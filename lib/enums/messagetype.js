/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

var CONNECTION = 'connection',
    CONNECT = 'connect',
    MESSAGE = 'message',
    JOIN_ROOM = 'joinRoom',
    REGISTER = 'register',
    REQUEST_NUM_OF_USERS = 'numberOfUsersInRoom',
    STATE_CHANGE = 'stateChange',
    STORE_STATE = 'storeState',
    PRIVATE_MESSAGE = 'privmessage',
    GET_STATE = 'getState',
    DISCONNECT = 'disconnect',
    DBCONNECTOR = 'dbconnector';

if (typeof exports !== 'undefined') {
    exports.CONNECTION = CONNECTION;
    exports.CONNECT = CONNECT;
    exports.MESSAGE = MESSAGE;
    exports.JOIN_ROOM = JOIN_ROOM;
    exports.REGISTER = REGISTER;
    exports.REQUEST_NUM_OF_USERS = REQUEST_NUM_OF_USERS;
    exports.STORE_STATE = STORE_STATE;
    exports.STATE_CHANGE = STATE_CHANGE;
    exports.PRIVATE_MESSAGE = PRIVATE_MESSAGE;
    exports.GET_STATE = GET_STATE;
    exports.DISCONNECT = DISCONNECT;
    exports.DBCONNECTOR = DBCONNECTOR;
}