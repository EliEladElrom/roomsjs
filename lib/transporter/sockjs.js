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
  var sockjs = require('sockjs');
  server = sockjs.createServer();

  server.on(messagetype.CONNECTION, function (socket) {
    selectedNode = socket;
    allNodes[selectedNode.id] = selectedNode;

    exports.sendMessage(selectedNode.id, messagetype.CONNECT, {});

    var events = require('events');
    var eventEmitter = new events.EventEmitter();
    selectedNode.evt = eventEmitter;

    onConnectionHandler();

    selectedNode.on('data', function (message) {
      var parsed = JSON.parse(message);
      log(parsed.message);
      selectedNode.evt.emit(parsed.message, parsed.data);
    });

    selectedNode.on('close', function () {
      onCloseConnectionHandler(this.id);
      exports.deleteNode(this.id);
      onCloseConnectionHandler(this.id);
    });

    selectedNode.evt.on('register', function (data) {
      log('register: ' + JSON.stringify(data));
    });
  });

  server.installHandlers(httpServer, {prefix : '/echo'});
};

exports.deleteNode = function (id) {
  'use strict';
  delete allNodes[id];
};

exports.sendMessage = function (to, message, data) {
  'use strict';
  var parsed = JSON.stringify({ message: message, data : data });
  allNodes[to].write(parsed);
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