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

  var server = require('socket.io').listen(httpServer, {
    log: false,
    transports: ['flashsocket', 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
  });

  server.sockets.on(messagetype.CONNECTION, function (socket) {
    selectedNode = socket;
    allNodes[selectedNode.id] = selectedNode;

    log('CONNECTION: ' + selectedNode.id);
    exports.sendMessage(selectedNode.id, messagetype.CONNECT, {});

    var events = require('events'),
      eventEmitter = new events.EventEmitter();

    selectedNode.evt = eventEmitter;

    allNodes[selectedNode.id].emit('user connected');

    onConnectionHandler();

    selectedNode.on('message', function (message) {
      var parsed = JSON.parse(message);
      log(parsed.message);
      selectedNode.evt.emit(parsed.message, parsed.data);
    });

    selectedNode.on('disconnect', function () {
      log('close: ' + this.id);
      onCloseConnectionHandler(this.id);
      exports.deleteNode(this.id);
    });

    selectedNode.on('register', function (data) {
      log('register: ' + JSON.stringify(data));
    });
  });
};

exports.deleteNode = function (id) {
  'use strict';
  delete allNodes[id];
};

exports.sendMessage = function (to, message, data) {
  'use strict';

  if (allNodes.hasOwnProperty(to)) {
    // console.log('allNodes[' + to + ']: ' + data);
    allNodes[to].emit(message, data);
  } else {
    log('sendMessage: missing user: ' + to);
  }
};

// mapping event to function!
exports.selectedNode = function (messageType, call_opt) {
  'use strict';
  selectedNode.evt.on(messageType, function (data) {
    call_opt(data);
  });
}

exports.selectedNodeId = function () {
  'use strict';
  return selectedNode.id;
}

exports.createRoom = function (roomName, call_opt) {
  'use strict';
  log('createRoom');
};

exports.joinRoom = function (roomName) {
  'use strict';
  log('joinRoom');
};

var log = function logmsg(message) {
  "use strict";
  if (global.isdebugmode) {
    console.log(message);
  }
}
