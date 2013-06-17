var messagetype = require('./enums/messagetype.js'),
    basketutil =  require('./utils/basketutil.js'),
    states,
    socketio,
    io,
    socket,
    basket;

var Rooms = module.exports = function (options) {
    "use strict";

    if (options === 'undefined') {
        options = {};
    }

    Rooms.prototype.listenToRoomEvents(options);
};

Rooms.prototype.listenToRoomEvents = function (options) {
    "use strict";

    // init
    states = basket = {};

    if (options.socketio === null) {
        socketio = require('socket.io');
    } else {
        socketio = options.socketio;
    }

    basketutil.setConstant(states, 'STATE', 'state');
    basketutil.setConstant(states, 'SUBSCRIPTIONS', 'subscriptions');
    basketutil.setConstant(states, 'USERS', 'users');

    basketutil.isdebugmode = options.isdebug;

    io = socketio.listen(options.server, {
        log: false,
        transports: ['flashsocket', 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
    });

    io.sockets.on(messagetype.CONNECTION, function (selectedSocket) {
        basketutil.log('new user connected');

        socket = selectedSocket;

        socket.on(messagetype.JOIN_ROOM, function (data) {
            Rooms.prototype[messagetype.JOIN_ROOM](data);
        });

        socket.on(messagetype.SUBSCRIPTIONS, function (data) {
            Rooms.prototype[messagetype.SUBSCRIPTIONS](data);
        });

        socket.on(messagetype.REGISTER, function (data) {
            Rooms.prototype[messagetype.REGISTER](data);
        });

        socket.on(messagetype.STORE_STATE, function (data) {
            Rooms.prototype[messagetype.STORE_STATE](data);
        });

        socket.on(messagetype.GET_STATE, function (data) {
            Rooms.prototype[messagetype.GET_STATE](data);
        });

        socket.on(messagetype.PRIVATE_MESSAGE, function (data) {
            var to = basket[data.to];
            io.sockets.socket(to).emit(data.msg);
        });

        socket.on(messagetype.REQUEST_NUM_OF_USERS, function (data) {
            Rooms.prototype[messagetype.REQUEST_NUM_OF_USERS](data);
        });

        socket.on(messagetype.MESSAGE, function (data) {
            Rooms.prototype[messagetype.MESSAGE](data);
        });

        socket.on(messagetype.DBCONNECTOR, function (data) {
            Rooms.prototype[messagetype.DBCONNECTOR](data);
        });

        socket.on(messagetype.DISCONNECT, function () {
            Rooms.prototype[messagetype.DISCONNECT]();
        });
    });
}

Rooms.prototype[messagetype.JOIN_ROOM] = function (data) {
    "use strict";

    socket.set('room', data.roomName, function () {
        basketutil.log('room:: ' + data.roomName + ' saved');
    });

    if (!data.hasOwnProperty(states.SUBSCRIPTIONS)) {
        data[states.SUBSCRIPTIONS] = null;
    }

    basketutil.setBasketObjectSceme(basket, data.roomName, data[states.SUBSCRIPTIONS], states);
    socket.join(data.room);
}

Rooms.prototype[messagetype.SUBSCRIPTIONS] = function (data) {
    var room = data.room,
        data_name = data.name,
        userId = data.userId;

    if (!basket[room][states.SUBSCRIPTIONS].hasOwnProperty(data_name)) {
        basket[room][states.SUBSCRIPTIONS][data_name] = {};
    }

    if (!basket[room][states.SUBSCRIPTIONS][data_name].hasOwnProperty(userId)) {
        basket[room][states.SUBSCRIPTIONS][data_name][userId] = true;
    }
}

Rooms.prototype[messagetype.REGISTER] = function (data) {
    if (!basket[data.roomName][states.USERS].hasOwnProperty(data.userId)) {
        basket[data.roomName][states.USERS][data.userId] = socket.id;
    }

    basketutil.log("User register:" + data.userId);

    if (basket[data.roomName][states.SUBSCRIPTIONS].hasOwnProperty('RoomInfoVO')) {
        var size = basketutil.size(basket[data.roomName][states.USERS]),
            users = basket[data.roomName][states.USERS],
            id,
            retData;

        for (id in users) {
            retData = {};
            retData.size = size;
            retData.register = data.userId;
            io.sockets.socket(users[id]).emit(messagetype.REQUEST_NUM_OF_USERS, retData);
            basketutil.log("send REQUEST_NUM_OF_USERS message to: " + id);
        }
    }
}

Rooms.prototype[messagetype.STORE_STATE] = function (data) {
    socket.get('room', function(err, room) {
        basketutil.log("store state: " + data.name + ' in room ' + room);

        if (!basket[room][states.STATE].hasOwnProperty(data.name)) {
            basket[room][states.STATE][data.name] = {};
            if (!basket[room][states.STATE][data.name].hasOwnProperty(data.sessionId)) {
                basket[room][states.STATE][data.name] = {};
            }
            basket[room][states.STATE][data.name][data.userId] = data.vo;
        }

        if (basket[room][states.SUBSCRIPTIONS].hasOwnProperty(data.name)) {
            var users = basket[room][states.USERS],
                dataBack = {},
                id;

            dataBack.name = data.name;
            dataBack.vo = data.vo;

            for (id in users) {
                if (id !== data.userId) {
                    io.sockets.socket(users[id]).emit(messagetype.STATE_CHANGE, dataBack);
                }
            }
        }
    });
}

Rooms.prototype[messagetype.GET_STATE] = function (data) {
    var size = basketutil.size(basket[data.room][states.STATE]),
        to,
        object;

    if (size > 0) {
        basketutil.log('state request for state: ' + data.stateName + ' from userId: ' + data.userId + ', in room: ' + data.room);
        to = basket[data.room][data.userId];
        object = {};
        object.name = data.stateName;
        object.vo = basket[data.room][states.STATE][data.stateName];
        io.sockets.socket(to).emit(messagetype.GET_STATE,object);
    } else {
        basketutil.log('No state in room: ' + data.room);
    }
}

Rooms.prototype[messagetype.REQUEST_NUM_OF_USERS] = function (data) {
    var to = basket[data.room][states.USERS][data.userId],
        size = basketutil.size(basket[data.room][states.USERS]),
        retData;

    basketutil.log("send numberOfUsersInRoom to: " + data.userId + ':' + to + ', in room: ' + data.room);

    retData = {};
    retData.size = size;

    io.sockets.socket(to).emit(messagetype.REQUEST_NUM_OF_USERS, retData);
}

Rooms.prototype[messagetype.MESSAGE] = function (data) {
    basketutil.log("Client data: " + data);
    socket.get('room', function (err, room) {
        io.sockets.in(room).emit('message', data);
    });
}

Rooms.prototype[messagetype.DBCONNECTOR] = function (data) {
    var retVal,
        users;

    basketutil.log("Client data: " + data.userId + ', calltype: ' + data.methodName);

    if (dbconnector.hasOwnProperty(data.methodName)) {

        dbconnector[data.methodName](data, function (data, vo) {
            basketutil.log('dbconnectorCallBack to user ' + data.userId);
            retVal = { data : data, vo : vo };
            users = basket[data.room][states.USERS];
            io.sockets.socket(users[data.userId]).emit(messagetype.DBCONNECTOR, retVal);
        });

    } else {
        basketutil.log("method doesn't exists");
    }
}

Rooms.prototype[messagetype.DISCONNECT] = function () {
    var retObject = basketutil.cleanRoom(socket, basket, states),
        data,
        users,
        id;

    basket = retObject.basket;

    if (basketutil.checkIfRoomHasSubscriptions(retObject.room, basket, states, 'RoomInfoVO')) {
        data = {size: basketutil.size(basket[retObject.room][states.USERS]), disconnect: retObject.disconnectUserId};
        users = basket[retObject.room][states.USERS];

        for (id in users) {
            io.sockets.socket(users[id]).emit(messagetype.REQUEST_NUM_OF_USERS, data);
            basketutil.log("send REQUEST_NUM_OF_USERS message to: " + id);
        }
    }
}

function RoomInfoVO(numberOfUsersInRoom) {
    "use strict";
    this.numberOfUsersInRoom = numberOfUsersInRoom;
}