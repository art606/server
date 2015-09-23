
var WSHandler = require("./../handlers/WSHandler")
var ticketsManager = require("./../services/ticketsManager")
/**
 * Created by ArturK on 2015-09-18.
 */
var ticketsHandler ={
    ticketWatchers : new Array(),
    registerTicketWatch : function(ticket, clientId){
        var idOfTheClient = clientId;
        console.log("registerTicketWatch", ticket);
         ticketsManager.get(ticket._id, function(storedTicket){
            console.log('registerTicketWatch ',storedTicket);
            if (storedTicket === undefined){
                throw "Ticket "+ticket._id+" not Found";
            }
             ticketsHandler.notifyTicketWatchers(storedTicket, clientId);
            console.log("ID OF THE CLIENT, ", idOfTheClient);
            ticketsHandler.ticketWatchers.push({ticketId: storedTicket._id, clientId: clientId});
            setTimeout(_changeTicketStatus, 5000, storedTicket.ticketNumber , clientId, 'CALLED');
             //
         });

    },
    notifyTicketWatchers : function(ticket, clientId){
        console.log(clientId)
        console.log("in TicketsHandler, notify ticket watchers, ticket: ", ticket );
        WSHandler.sendToAClient(ticket, clientId);
    }

}

/*
 * Tymczasowa metoda do czasu podlaczenia do serwera
 * */
function _changeTicketStatus(ticketId, clientId, status) {
    console.log("_changeTicketStatus", ticketId);
    var ticketFromDB = ticketsManager.getByOrigId(ticketId, function(storedTicket){
        if (storedTicket === undefined || storedTicket === null){
            console.log("Ticket for origId="+ticketId+" not Found");
            return;
        }
        console.log("in _changeTicketStatus, result from the db: ", storedTicket);
        storedTicket.ticketStatus = status;
        ticketsManager.store(storedTicket, function(result){
            console.log("in TicketsHandler, after store, result: ", result);
            ticketsHandler.notifyTicketWatchers(storedTicket, clientId);
            setTimeout(_changeTicketStatus, 5000, storedTicket.ticketNumber , clientId, 'CLOSED');
        });

    });
}



module.exports = ticketsHandler;