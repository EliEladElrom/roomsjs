/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

var socketio = require('socket.io'),
    transporter,
    allNodes,
    selectedNode;

exports.start = function (server) {
    'use strict';
    var io = socketio.listen(server, {
        log: false,
        transports: ['flashsocket', 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
    });

    allNodes = io.sockets;
};

exports.sendMessage = function (to, message, data) {
    'use strict';
    allNodes.socket(to).emit(message, data);
};

exports.emit = function (to, message, data) {
    'use strict';
    transporter.socket(to).emit(message, data);
};

exports.onMessage = function (messageType, call_opt) {
    'use strict';
    allNodes.on(messageType, function (data) {
        selectedNode = data;
        call_opt();
    });
};

exports.selectedNode = function (messageType, call_opt) {
    'use strict';
    selectedNode.on(messageType, function (data) {
        call_opt(data);
    });
}

exports.createRoom = function (roomName, call_opt) {
    'use strict';
    selectedNode.set('room', roomName, call_opt);
};

exports.joinRoom = function (roomName) {
    'use strict';
    selectedNode.join(roomName);
};

exports.sendMessageToAllInRoom = function (room, data) {
    'use strict';
    allNodes.in(room).emit('message', data);
};

exports.selectedNodeId = function () {
    return selectedNode.id;
}

exports.findClosedUserId = function (basket) {
    var closed = allNodes.manager.closed,
        match = undefined;

    var retVal = Object.keys(basket).some(function (room) {
        // console.log('checking room: ' + room);
        Object.keys(closed).forEach(function (s_user_key) {
            Object.keys(basket[room].users).forEach(function (b_user_key) {
                // console.log('user: ' + b_user_key + ', socket key: ' + basket[room].users[b_user_key]);
                // console.log('compare: ' + s_user_key + ', with: ' + basket[room].users[b_user_key]);
                if (s_user_key === basket[room].users[b_user_key]) {
                    // console.log('found match: ' + s_user_key);
                    match = s_user_key;
                    return true;
                }
            });
        });

        return false;
    });

    return match;
}