/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

var socketio = require('socket.io'),
    transporter,
    io,
    selectedSocket;

exports.emit = function (id, message, data) {
    'use strict';
    transporter.socket(id).emit(message, data);
};

exports.listen = function (server) {
    'use strict';
    io = socketio.listen(server, {
        log: false,
        transports: ['flashsocket', 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
    });
};

exports.on = function (messageType, call_opt) {
    'use strict';
    io.sockets.on(messageType, function (data) {
        selectedSocket = data;
        call_opt();
    });
};

exports.onSelectedSocket = function (messageType, call_opt) {
    'use strict';
    selectedSocket.on(messageType, function (data) {
        call_opt(data);
    });
}

exports.set = function (roomName, call_opt) {
    'use strict';
    selectedSocket.set('room', roomName, call_opt);
};

exports.join = function (roomName) {
    'use strict';
    selectedSocket.join(roomName);
};

exports.send = function (to, message, data) {
    'use strict';
    io.sockets.socket(to).emit(message, data)
};

exports.sendToAll = function (room, data) {
    'use strict';
    io.sockets.in(room).emit('message', data);
};

exports.id = function () {
    return selectedSocket.id;
}

exports.findDisconnectedId = function (basket) {
    var closed = io.sockets.manager.closed,
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