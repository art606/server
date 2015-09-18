var WebSocketServer = require('ws').Server;
var Log = require('log');
var log = new Log('info');


var wss;
var responseTime = 10;
var connections = {};
var tickets= [];
var connectionIDCounter = 0;

wss = new WebSocketServer({port: 4000});

wss.on('connection', function (ws) {

    // Store a reference to the connection using an incrementing ID
    ws.clientId = connectionIDCounter;
    ws.clientId++  ;
    connectionIDCounter = ws.clientId;
    connections[ws.clientId] = ws ;



    ws.on('error', function () {
        ws.close(500, 'error');
    });

    ws.on('close', function () {
        log.info('ws', 'connection closed.');
        // Make sure to remove closed connections from the global pool
        delete connections[ws.id];
        ws.close(1000);
    });

    ws.on('message', function (message) {
        messageHandler(message);
    });

});

wss.on('listening', function () {
    log.info('Websocket Server running');
});

wss.on('error', function (error) {
    log.error('Error starting websocket server %s', error);
});

var messageHandler = function (message) {
    console.log("in message handler")
    var ms = JSON.parse(message);
    console.log(ms)
    switch(ms.operation){
        case 'GET_TICKET':
            console.log("case")
            handleTicketRegistration(ms);
            break;
        default:
            console.log("Unknown message type.")
    }
}

var handleTicketStatus = function(ticket){
    console.log("In handleTicektStatus");
    var clientId = ticket.clientId;
    var data = "Calling";
    //response(connectionIDCounter, message);
    setTimeout(sendToClient(clientId, data), 5000);
}

var handleTicketRegistration = function(message){
    var registeredTicket = {};
    registeredTicket.ticketId = message.ticket._id;
    registeredTicket.clientId = connectionIDCounter;
    tickets.push(registeredTicket);
    console.log(registeredTicket, "registered ticket")
    searchForATicket(registeredTicket);
}
function searchForATicket(ticket){
    console.log(ticket.ticketId, "in search for a ticekt");
    var value = ticket.ticketId;
    var result = {};
    console.log("0")

    for (var i=0, iLen=tickets.length; i<iLen; i++) {
        console.log("1")
        if (tickets[i].ticketId === value) {
            return result = tickets[i];
            console.log("here 2")
        }else {
            console.log("shit ")
        }
    }

}
/*var response = function(connectionId, message){
    console.log("in response function")
    console.log(message)
    message.ticket.ticketStatus = "Calling";
    console.log("response", message)
    sendToConnectionId(connectionId, message)

}*/



function sendToClient(connectionID, data) {
    console.log("in send to connectio id function")
    connections[connectionID].send(data)
    console.log("end")
}
