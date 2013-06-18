var _isdebugmode = true;

var setConstant = function (obj, name, value) {
    "use strict";
    Object.defineProperty(obj, name, {
        get : function () {
            return value;
        }
    });
};

var log = function logmsg(message) {
    "use strict";
    if (_isdebugmode)
        console.log(message);
}


size = function (obj) {
    "use strict";
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

cleanRoom = function (socket,basket,states) {

    var retVal = [];

    for (var room in basket) {
        for (var id in basket[room][states.USERS]) {
            if (basket[room][states.USERS][id] == socket.id) {
                delete basket[room][states.USERS][id];
                var room_size = size(basket[room][states.USERS]);
                retVal.disconnectUserId = id;
                retVal.room = room;
                log('------- Client ' + id + ' Disconnected from room: ' + room + ', num of users left: '+room_size);
                if (room_size == 0) {
                    delete basket[room];
                    log('Delete room: ' + room);
                }
            }
        }
    }

    retVal.basket = basket;

    return retVal;
}

checkIfRoomHasSubscriptions = function (room,basket,states,subscribeTo) {
    if (basket.hasOwnProperty(room) && basket[room][states.SUBSCRIPTIONS].hasOwnProperty(subscribeTo))
        return true;
    else
        return false;
}

setBasketObjectSceme = function (basket, roomName,subscriptions,states) {
    if ( ! basket.hasOwnProperty(roomName) ) {
        basket[roomName] = {};
        basket[roomName][states.STATE] = {};
        basket[roomName][states.SUBSCRIPTIONS] = {};
        basket[roomName][states.USERS] = {};

        if ( subscriptions ) {
            basket[roomName][states.SUBSCRIPTIONS] = subscriptions;
        }
    }
}

if (typeof exports != 'undefined' ) {
    exports.setConstant = setConstant;
    exports.log = log;
    exports.size = size;
    exports.setBasketObjectSceme = setBasketObjectSceme;
    exports.cleanRoom = cleanRoom;
    exports.checkIfRoomHasSubscriptions = checkIfRoomHasSubscriptions;
    exports.isdebugmode = _isdebugmode;
}