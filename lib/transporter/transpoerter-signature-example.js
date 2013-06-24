/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

var allNodes,
    selectedNode;

exports.start = function (server) {
    'use strict';
};

exports.sendMessage = function (to, message, data) {
    'use strict';
};

exports.onMessage = function (messageType, call_opt) {
    'use strict';
};

exports.selectedNode = function (messageType, call_opt) {
    'use strict';
}

exports.createRoom = function (roomName, call_opt) {
    'use strict';
};

exports.joinRoom = function (roomName) {
    'use strict';
};

exports.sendMessageToAllInRoom = function (room, data) {
    'use strict';
};

exports.selectedNodeId = function () {
    'use strict';
    return 0;
}

exports.findClosedUserId = function (basket) {
    'use strict';
    return 0;
}