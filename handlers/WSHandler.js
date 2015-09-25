/**
 * Created by ArturK on 2015-09-18.
 */
var messagesHandler = require("./../handlers/messagesHandler")
var WebSocketServer = require('ws').Server
var connections = [];
var connectionIDCounter = 1;
module.exports = {data : 1};
var wss;
module.exports.server = function(){return wss}
module.exports.init = function (server) {

    wss = new WebSocketServer({server: server, path: '/sockets/'});
    wss.on('connection', function (ws) {
        // Store a reference to the connection using an incrementing ID
        connectionIDCounter++;
        ws.clientId =connectionIDCounter;
        //connections[ws.clientId] = ws;
        console.log("New connection -"+ws.clientId );

        ws.on('close', function () {
            console.log("New closing -"+ws.clientId );
           // delete connections[ws.clientId];
          //  console.log(connections)
        });
        ws.on('error', function () {
            console.log("New error -"+ws.clientId );
            ws.close(500, 'error');
          //  delete connections[ws.clientId];
        });
        ws.on('message', function (data, flags) {
            console.log("New message -"+ws.clientId );
            var message = JSON.parse(data);
            var clientId = ws.clientId;
            messagesHandler.handleMessage(message.operation, message.data, clientId);
        });
    });

    wss.on('listening', function () {
        console.log('ws', 'Websocket Server running on port %d...', server.address().port);
    });

    wss.on('error', function (error) {
        console.log('ws', 'Error starting websocket server %s', error);
    });
};

module.exports.send = function (operation, data, connectionID) {
    try {
        console.log("Sending to ",connectionID);
        var found = false;
        wss.clients.forEach(function(client){
            if (client.clientId === connectionID) {
                console.log("Client found ", connectionID);
                found = true;
                client.send(JSON.stringify({operation: operation, data: data}));
            }
        });
        if (!found)
            console.log("Client not found ",connectionID);

    }catch(e){
        console.log(e);
    }
}
module.exports.disconnectClient = function (connectionID) {
    console.log("New disconnectClient "+connectionID );
    wss.clients.forEach(function(client){
        if (client.clientId === connectionID)
            client.close();
    })
}
