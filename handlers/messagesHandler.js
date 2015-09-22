/**
 * Created by ArturK on 2015-09-18.
 */
var ticketsHandler = require('./../handlers/ticketsHandler');

module.exports = {

    handleMessage : function (message, clientId) {
        console.log("WSHandler.messageHandler")
        console.log(message)
        console.log("WSHandler.messageHandler operation: "+message.operation)
        switch (message.operation) {
            case 'WATCH_TICKET':
                ticketsHandler.registerTicketWatch(message.ticket, clientId);
                break;
            default:
                console.log("Unknown message type.")
        }

    }
};