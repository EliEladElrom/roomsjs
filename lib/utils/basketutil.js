/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

var log = function logmsg(message) {
  "use strict";
  if (global.isdebugmode) {
      console.log(message);
  }
}

size = function (obj) {
  "use strict";
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

cleanRoom = function (socketId,basket,states) {

  var retVal = [];

  console.log('basket: ' + JSON.stringify(basket));

  for (var room in basket) {
    for (var id in basket[room][states.USERS]) {
      console.log('checking room: ' + room + ', id: ' + basket[room][states.USERS][id] + ', against: ' + socketId);
      if (basket[room][states.USERS][id] === socketId) {
        delete basket[room][states.USERS][id];
        var room_size = size(basket[room][states.USERS]);
        retVal.disconnectUserId = id;
        retVal.room = room;
        log('------- Client ' + id + ':' + socketId + ' Disconnected from room: ' + room + ', num of users left: '+room_size);
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
  exports.log = log;
  exports.size = size;
  exports.setBasketObjectSceme = setBasketObjectSceme;
  exports.cleanRoom = cleanRoom;
  exports.checkIfRoomHasSubscriptions = checkIfRoomHasSubscriptions;
}