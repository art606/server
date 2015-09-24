var WSHandler = require("./../handlers/WSHandler")
var ticketsManager = require("./../managers/ticketsManager")
/**
 * Created by ArturK on 2015-09-18.
 */
var ticketsHandler = {

    ticketWatchers: new Array(),

    registerTicketWatch: function (ticket, clientId) {
        console.log("registerTicketWatch ",ticket);
        var idOfTheClient = clientId;
        ticketsManager.get(ticket._id, function (err,storedTicket) {
            if (storedTicket === undefined || storedTicket === null) {
                throw "Ticket  not Found", ticket;
            }

            ticketsHandler.ticketWatchers.push({origId: storedTicket.origId, clientId: clientId});
            console.log("XXXXX",clientId);

            console.log("before changeTicektStatus")
            setTimeout(_changeTicketStatus, 5000, storedTicket.origId, storedTicket.branchOrigId, 'CALLED');
            setTimeout(_changeTicketStatus, 10000, storedTicket.origId,storedTicket.branchOrigId, 'CLOSED');
        });
    },
    getClientId : function(origId){
        console.log("getClientId, ", origId)
        for (var i=0;i<ticketsHandler.ticketWatchers.length;i++){
            if (ticketsHandler.ticketWatchers[i].origId === origId)
                console.log("getClietnId if), ", ticketsHandler.ticketWatchers[i].clientId)
            return ticketsHandler.ticketWatchers[i].clientId;
        }
        return null;
    },
    notifyTicketWatchers: function (ticket) {
        var i = ticket.origId;
        console.log("NOTIFYtICKETwATCHERS: orig", i)
        var clientId = ticketsHandler.getClientId(i);
        console.log("notify ticket watchers", clientId)

        WSHandler.send("TICKET_UPDATED", ticket, clientId);
        console.log("after send to clienmt")
    },
    cancelTicketWatch: function (ticket, clientId) {
        var idOfTheClient = clientId;
        ticketsManager.delete(ticket, function () {
            WSHandler.disconnectClient(clientId);
        });

    },
    printTicket: function (service, params, callback) {
        // W przysz�osci Po��cz do OAS
        _generateNewTicket(service, params, function (err, ticket) {
            console.log(ticket);
            ticketsManager.store(ticket, callback);
        })

    },
    onTicketUpdate: function (origTicket) {
        console.log("in onTicketUpdate, parameter:  ", origTicket)
        var ticketFromDB = ticketsManager.getByOrigId(origTicket.branchOrigId, origTicket.origId, function (err, storedTicket) {
            console.log("KURWA MAC: ", storedTicket)
            console.log("lol", err)
            if (storedTicket === undefined || storedTicket === null) {
                console.log("storedTicket:", storedTicket)
                ticketsManager.store(storedTicket, function (result) {
                    console.log("in onTicketUpdate, after getByOrigID, storedTicket: ", result)
                    storedTicket.status = origTicket.status;
                    console.log(result)
                    ticketsHandler.notifyTicketWatchers(storedTicket);
                });
            } else{
                ticketsManager.store(storedTicket, function (result) {
                    storedTicket.status = origTicket.status;
                    console.log("onTicketUpdate old Ticket update: ", result);
                    ticketsHandler.notifyTicketWatchers(storedTicket);
                });
            }

        })
    }
}

/*
 * Tymczasowa metoda do czasu podlaczenia do serwera
 * */
function _changeTicketStatus(origId, branchId, status) {
    console.log("in ChangeTicketStatus: ", origId, branchId, status)
   ticketsHandler.onTicketUpdate(
       {
           origId : origId,
           branchOrigId: branchId,
           status : status
       }
   );
}
function _generateNewTicket(service, params, callback) {
    console.log(service);
    ticketsManager.getAll(service._id, function (err, tickets) {
        console.log(tickets.length)
        var lastTicketNumber = 0;
        if (err || tickets === undefined || tickets === null || tickets.length === 0) {

        } else {
            lastTicket = tickets[tickets.length - 1];
            lastTicketNumber = lastTicket.number;
        }
        lastTicketNumber++;
        var ticket = {
            branchId: service.branchId,
            serviceId: service._id,
            origId: lastTicketNumber,
            branchOrigId: service.branchOrigId,
            status: "WAITING",
            letter: service.letter,
            number: lastTicketNumber
        }
        callback(err, ticket);
    });

}
module.exports = ticketsHandler;