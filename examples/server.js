'use strict';

var os = require('os'),
  rooms = require('roomsjs'),
  roomdb = require('rooms.db'),
  bodyParser = require('body-parser'),
  port = (process.env.PORT || 8081);

// create express server if needed
var express = require('express'),
  app = express().use(express.static(__dirname + '/public'));

// needed for parsing post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// engine.io, socket.io
var server = require('http').createServer(app).listen(port, function () {
  console.log('Listening on http://' + os.hostname() + ':' + port);
});
// OR for sockjs
// var server = require('http').createServer(app).listen(port, '0.0.0.0');

// services
roomdb.setServices('services_example/', app, 'get');
roomdb.setServices('services_post_example/', app, 'post');

// connect to different database/s if needed
// Mysql:
// roomdb.connectToDatabase('mysql', 'localhost', {user: 'root', password: ''});
// MongoDB
roomdb.connectToDatabase('mongodb', 'mongodb://localhost/test', {});

// set rooms
rooms = new rooms({
  isdebug : true,
  transporter : {
    type: 'engine.io', /* options: engine.io|socket.io|sockjs */
    server : server
  },
  roomdb : roomdb /* or null if db not needed */
});
