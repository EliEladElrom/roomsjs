'use strict';

var os = require('os'),
  rooms = require('roomsjs'),
  roomdb = require('rooms.db'),
  port = (process.env.PORT || 8081);

// create express server if needed
var express = require('express'),
  app = express().use(express.static(__dirname + '/client'));

// engine.io, socket.io
var server = require('http').createServer(app).listen(port, function () {
  console.log('Listening on http://' + os.hostname() + ':' + port);
});

// services
roomdb.setServices('services_sample/');
roomdb.connectToDatabase('mysql', 'localhost', {user: 'root', password: ''});

// set rooms
rooms = new rooms({
  isdebug : true,
  transporter : {
    type: 'engine.io',
    server : server
  },
  roomdb : roomdb
});