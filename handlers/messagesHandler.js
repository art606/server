/**
 * Created by ArturK on 2015-09-18.
 */

module.exports = (function(){

    return {

        handleMessage: function (operation, data, clientId) {
            console.log("messages" , require("./../handlers/ticketsHandler"))
            switch (operation) {
                case 'WATCH_TICKET':
                    require("./../handlers/ticketsHandler").registerTicketWatch(data, clientId);
                    break;
                case 'CANCEL_WATCH_TICKET':
                    require("./../handlers/ticketsHandler").cancelTicketWatch(data, clientId);
                    break;
                default:
                    console.log("Unknown message type.")
            }
            console.log("change 1")
        }
    }
})();