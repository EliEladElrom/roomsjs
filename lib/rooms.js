/*
 * Copyright 2018 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

"use strict";

var messagetype = require('./enums/messagetype.js'),
    basketutil =  require('./utils/basketutil.js'),
    p2pmaster = require('./utils/p2pmaster.js'),
    states,
    transporter,
    basket,
    transporterCallback,
    robotsMsgCallbacks = [],
    peers = [],
    roomdb;

var Rooms = module.exports = function (options) {

    if (options === undefined) {
        console.log('You must define options -- exit');
        process.exit(0);
    }

    Rooms.prototype.listenToRoomEvents(options);
};

Rooms.prototype.listenToRoomEvents = function (options) {

    basket = {};
    roomdb = options.roomdb;

    states = {
        STATE : 'state',
        SUBSCRIPTIONS : 'subscriptions',
        USERS : 'users'
    };

    global.isdebugmode = options.isdebug;
    Rooms.prototype.setIOBasedOnTransporter(options);
}

Rooms.prototype.setIOBasedOnTransporter = function (options) {

    transporterCallback = options.transporter.transporterCallback;

    switch (options.transporter.type) {
        case 'socket.io':
            transporter = require('./transporter/socketio');
            break;
        case 'engine.io':
            transporter = require('./transporter/engineio');
            break;
        case 'sockjs':
            transporter = require('./transporter/sockjs');
            break;
    }

    transporter.start(options.transporter.server,
        function () {
            basketutil.log('start transport server');
            Rooms.prototype.addSocketMapping();
        },
        function (closedUserId) {
            Rooms.prototype[messagetype.DISCONNECT](closedUserId);
        }
    );

    p2pmaster.initP2PMasterServer('roomsjs', p2pmaster.PEER_MASTER, roomsCallbackFromP2P);
}

Rooms.prototype.addSocketMapping = function () {
    Object.keys(messagetype).forEach(function (key) {
        transporter.selectedNode(messagetype[key], function (data) {
            Rooms.prototype[messagetype[key]](data);
            transporterCallback(messagetype[key], data);
            robotsMsgCallbacks.forEach(function(call) {
                call.robotMsgCallback(messagetype[key], data);
            });
        });
    });
}

Rooms.prototype[messagetype.JOIN_ROOM] = function (data) {
    transporter.createRoom(data.roomName, function () {
        basketutil.log('room:: ' + data.roomName + ' saved');
    });

    if (!data.hasOwnProperty(states.SUBSCRIPTIONS)) {
        data[states.SUBSCRIPTIONS] = null;
    }

    basketutil.setBasketObjectSceme(basket, data.roomName, data[states.SUBSCRIPTIONS], states);
    transporter.joinRoom(data.room);
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
        basket[data.roomName][states.USERS][data.userId] = data.isRobot ? data.userId : transporter.selectedNodeId();
    }

    basketutil.log("User register: " + data.userId);

    if (data.hasOwnProperty('robotMsgCallback')) {
        robotsMsgCallbacks.push({
            userId: data.userId,
            robotMsgCallback: data.robotMsgCallback
        });
    }

    if (data.hasOwnProperty('isP2P')) {
        peers.push({
            userId: data.userId
        });
    }

    if (basket[data.roomName][states.SUBSCRIPTIONS].hasOwnProperty('RoomInfoVO')) {
        var size = basketutil.size(basket[data.roomName][states.USERS]),
            users = basket[data.roomName][states.USERS],
            id,
            retData;

        retData = {
            size : size,
            register : data.userId
        }

        let isRobot;
        for (id in users) {
            isRobot = false;
            if (data.userId !== id) {
                // message to robot
                sendMessage(users[id], messagetype.REQUEST_NUM_OF_USERS, retData);
                basketutil.log("send REQUEST_NUM_OF_USERS after user register to: " + id + ' num of ppl: ' + retData.size);
            }
        }
    }
}

Rooms.prototype[messagetype.STORE_STATE] = function (data) {
    var room = data.roomName;
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
                basketutil.log('SUBSCRIPTIONS: ' + data.name + messagetype.STATE_CHANGE);
                sendMessage(users[id], messagetype.STATE_CHANGE, dataBack);
            }
        }
    }
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
        sendMessage(to, messagetype.GET_STATE,object);
    } else {
        basketutil.log('No state in room: ' + data.room);
    }
}

Rooms.prototype[messagetype.REQUEST_NUM_OF_USERS] = function (data) {
    var to = basket[data.room][states.USERS][data.userId],
        size = basketutil.size(basket[data.room][states.USERS]),
        retData;

    retData = { size : size };
    basketutil.log("send numberOfUsersInRoom to: " + data.userId + ':' + to + ', in room: ' + data.room + ', size: ' + retData.size);
    sendMessage(to, messagetype.REQUEST_NUM_OF_USERS, retData);
}

Rooms.prototype[messagetype.DBCONNECTOR] = function (data) {
    var retVal,
        users;

    basketutil.log("dbconnector data: " + data.userId + ', calltype: ' + data.methodName);

    if (roomdb.hasOwnProperty(data.methodName)) {

        roomdb[data.methodName](data, function (data, vo) {
            basketutil.log('Connector callback to user ' + data.userId);
            retVal = { data : data, vo : vo };

            try {
                users = basket[data.room][states.USERS];
                sendMessage(users[data.userId], messagetype.DBCONNECTOR, retVal);
            } catch (error) {
                basketutil.log(states.USERS + " state doesn't exists to send a message!");
            }
        });

    } else {
        basketutil.log('\'' + data.methodName + "' method doesn't exists");
    }
}

Rooms.prototype[messagetype.DISCONNECT] = function (closedUserId) {
    var retObject,
        data,
        users,
        id;

    if (closedUserId === undefined && transporter && transporter.hasOwnProperty('findClosedUserId')) {
        closedUserId = transporter.findClosedUserId(basket);
    }

    // remove registered robot callback
    robotsMsgCallbacks = robotsMsgCallbacks.filter(function(call) {
        return call.userId !== closedUserId
    });

    // remove peers
    peers = peers.filter(function(peer) {
        return peer.userId !== closedUserId
    });

    retObject = basketutil.cleanRoom(closedUserId, basket, states);
    basket = retObject.basket;

    if (basketutil.checkIfRoomHasSubscriptions(retObject.room, basket, states, 'RoomInfoVO')) {

        data = { size: basketutil.size(basket[retObject.room][states.USERS]),
            disconnect: retObject.disconnectUserId
        };

        users = basket[retObject.room][states.USERS];

        for (id in users) {
            sendMessage(users[id], messagetype.REQUEST_NUM_OF_USERS, data);
            basketutil.log('send REQUEST_NUM_OF_USERS message to: ' + id + ', num of ppl: ' + data.size);
        }
    }
}

/*
 Input:

 data {
 fromUserId: string
 toUserId: string,
 room: string,
 msg: string
 }
 */
Rooms.prototype[messagetype.PRIVATE_MESSAGE] = function (data) {
    var to;

    if (!data.hasOwnProperty('fromUserId') && !data.hasOwnProperty('toUserId')) {
        basketutil.log('incorrect format');
        return;
    }

    if (!basket[data.room][states.USERS].hasOwnProperty(data.toUserId)) {
        to = basket[data.room][states.USERS][data.fromUserId];
        basketutil.log('user not connected');
        sendMessage(to, messagetype.PRIVATE_MESSAGE, data);
    } else {
        to = basket[data.room][states.USERS][data.toUserId];
        basketutil.log('send private message to: ' + to + ', msg: ' + data.msg);
        sendMessage(to, messagetype.PRIVATE_MESSAGE, data);
    }
}

function RoomInfoVO(numberOfUsersInRoom) {
    this.numberOfUsersInRoom = numberOfUsersInRoom;
}

let sendMessage = (userId, msg, data) => {
    let robot = false;
    for (var item of robotsMsgCallbacks) {
        if (item.userId == userId) {
            basketutil.log("msgToRobot: userId: " + userId + ', msg: ' + msg);
            item.robotMsgCallback(msg, data);
            robot = true;
        }
    }
    for (var peer of peers) {
        if (peer.userId == userId) {
            basketutil.log("msgToPeer: userId: " + userId + ', msg: ' + msg);
            messageToPeer(userId, msg, data);
            robot = true;
        }
    }
    if (!robot) {
        // send transporter
        basketutil.log("msgToTransporter: userId: " + userId + ', msg: ' + msg);
        transporter.sendMessage(userId, msg, data);
    }
}

let roomsCallbackFromP2P = (userId, type, data) => {
    console.log('Message from p2p userId: ' + userId);
    if (type === messagetype.DISCONNECT)
        Rooms.prototype[type](data.userId);
    else
        Rooms.prototype[type](data);
}

let messageToPeer = (toUserId, type, data) => {
    p2pmaster.writeMessageToPeer(toUserId, type, data);
}