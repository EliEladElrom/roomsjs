/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

var messagetype = require('../enums/messagetype.js'),
    allNodes = {},
    selectedNode,
    server;

exports.start = function (httpServer, onConnectionHandler, onCloseConnectionHandler) {
    'use strict';
    var engine = require('engine.io');
    server = engine.attach(httpServer);

    server.on(messagetype.CONNECTION, function (socket) {
        selectedNode = socket;
        allNodes[selectedNode.id] = selectedNode;

        exports.sendMessage(selectedNode.id, messagetype.CONNECT, {});
        onConnectionHandler();

        selectedNode.on('close', function () {
            onCloseConnectionHandler(selectedNode.id);
            delete allNodes[selectedNode.id];
            onCloseConnectionHandler(selectedNode.id);
        });
    });
};

exports.sendMessage = function (to, message, data) {
    'use strict';
    var parsed = JSON.stringify({ message: message, data : data });
    allNodes[to].write(parsed);
};

exports.onMessage = function (messageType, call_opt) {
    'use strict';
};

exports.selectedNode = function (messageType, call_opt) {
    'use strict';
    selectedNode.on(messageType, function (data) {
        call_opt(data);
    });
}

exports.createRoom = function (roomName, call_opt) {
    'use strict';
    // console.log('createRoom');
};

exports.joinRoom = function (roomName) {
    'use strict';
    // console.log('joinRoom');
};

exports.selectedNodeId = function () {
    'use strict';
    return selectedNode.id;
}