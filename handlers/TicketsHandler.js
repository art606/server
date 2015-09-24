var WSHandler = require("./../handlers/WSHandler")
var ticketsManager = require("./../managers/ticketsManager")
/**
 * Created by ArturK on 2015-09-18.
 */
var ticketsHandler = {

    ticketWatchers: new Array(),

    registerTicketWatch: function (ticket, clientId) {
        var idOfTheClient = clientId;
        ticketsManager.get(ticket._id, function (storedTicket) {
            if (storedTicket === undefined) {
                throw "Ticket " + ticket._id + " not Found";
            }
            ticketsHandler.notifyTicketWatchers(storedTicket, clientId);
            ticketsHandler.ticketWatchers.push({ticketId: storedTicket._id, clientId: clientId});

            setTimeout(_changeTicketStatus, 5000, storedTicket.origId, storedTicket.branchOrigId, 'CALLED');
            setTimeout(_changeTicketStatus, 10000, storedTicket.origId,storedTicket.branchOrigId, 'CLOSED');
        });

    },
    notifyTicketWatchers: function (ticket) {
        var clientId = ticketsHandler.ticketWatchers[ticket._id];
        WSHandler.send("TICKET_UPDATED", ticket, clientId);
    },
    cancelTicketWatch: function (ticket, clientId) {
        var idOfTheClient = clientId;
        ticketsManager.delete(ticket, function () {
            WSHandler.disconnectClient(clientId);
        });

    },
    printTicket: function (service, params, callback) {
        // W przysz³osci Po³¹cz do OAS
        _generateNewTicket(service, params, function (err, ticket) {
            console.log(ticket);
            ticketsManager.store(ticket, callback);
        })

    },
    onTicketUpdate: function (origTicket) {
        var ticketFromDB = ticketsManager.getByOrigId(origTicket.branchId, origTicket.ticketId, function (storedTicket) {
            if (storedTicket === undefined || storedTicket === null) {
                ticketsManager.store(origTicket, function (result) {
                    console.log("onTicketUpdate new Ticket stored ", result);
                });
            }else{
                ticketsManager.store(storedTicket, function (result) {
                    storedTicket.status = origTicket.status;
                    console.log("onTicketUpdate old Ticket update: ", result);
                    ticketsHandler.notifyTicketWatchers(storedTicket, clientId);
                });
            }
        })
    }
}

/*
 * Tymczasowa metoda do czasu podlaczenia do serwera
 * */
function _changeTicketStatus(ticketId, branchId, status) {
   ticketsHandler.onTicketUpdate(
       {
           ticketId :ticketId,
           branchId: branchId,
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