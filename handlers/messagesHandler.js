/**
 * Created by ArturK on 2015-09-18.
 */
var ticketsHandler = require('./../handlers/ticketsHandler');

module.exports = {

    handleMessage : function (operation, data, clientId){
        console.log("WSHandler.messageHandler operation: "+operation, data)
        switch (operation) {
            case 'WATCH_TICKET':
                ticketsHandler.registerTicketWatch(data, clientId);
                break;
            case 'CANCEL_WATCH_TICKET':
                ticketsHandler.cancelTicketWatch(data, clientId);
                break;
            default:
                console.log("Unknown message type.")
        }
        console.log("change 1")
    }
};