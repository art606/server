/**
 * Created by ArturK on 2015-09-18.
 */
var messagesHandler = require("./../handlers/messagesHandler")
var WebSocketServer = require('ws').Server
var connections = [];
var connectionIDCounter = 1;
module.exports.init = function (server) {
    wss = new WebSocketServer({server: server, path: '/sockets/'});
    wss.on('connection', function (ws) {
        // Store a reference to the connection using an incrementing ID
        ws.clientId = ++connectionIDCounter;
        connections[ws.clientId] = ws;

        ws.on('close', function () {
            delete connections[ws.clientId];
        });
        ws.on('error', function () {
            console.log('ws', 'error in websocket - closing');
            ws.close(500, 'error');
            delete connections[ws.clientId];
        });
        ws.on('message', function (data, flags) {
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
    connections[connectionID].send(JSON.stringify({operation : operation, data : data}));
}
module.exports.disconnectClient = function (connectionID) {
    connections[connectionID].close();
}