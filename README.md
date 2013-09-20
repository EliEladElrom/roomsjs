# roomsjs - streaming live data built to support different transporters

[![Build Status](https://secure.travis-ci.org/eladelrom/roomsjs-client.png)](http://travis-ci.org/eladelrom/roomsjs-client)
[![NPM version](https://badge.fury.io/js/roomsjs.png)](http://badge.fury.io/js/roomsjs)

![roomsjs logo](https://raw.github.com/eladelrom/roomsjs-client/master/roomsjs-logo.png)

A Javascript Node.JS module, provides a way to send and receive messages and switch different transporters for creating rooms and streaming data between users, streaming data from a database and even stream from a 3rd party CDN.
`roomsjs`, `roomsdb` and `roomsjs-client` together combine a powerful light-weight backend/front-end libraries built to stream live data and solve same problems related to real-time communications.

Node.js technology relatively young and memory leaks were found in `socket.io` and issues around `engine.io`'s `Websocket` transporter on certain `nodejs` version.

The API was built to allow you to just 'switch' and use any transporter and create your own implementation. Module also have additional feature to help managing rooms easily.

The idea is to give a simple API and allowing using different transporters and modify the client implementation instead of having to do an 'open heart surgery' when you are already committed to one transporter API or another.
It's recommended to use `engine.io` since it's the high level API of `socket.io`, however there are cases where you want to have the `socket.io` bloated code for certain functionality.  `rooms.js` is a lower level API, just like `socket.io`, however it's lighter weight and doesn't have the sugar and all the bell and whistle of `socket.io`, so it's here for you to use.

`roomsjs` has features such as:

    1. Connect to a room
    2. Register a user
    2. Request number of users
    3. Private message
    4. Video
    5. Create multiple rooms
    6. Store states.
    7. Subscribe to data VO.
    8. AMS/FMS Flash Webcam fallback
    9. HTML5 Webcam (still in development)
    10. Database connector (such as mysql, mongodb).
    11. Switch different transporters: currently supporting `socket.io`, `engine.io` and `SockJS`.
    12. Angularjs implementation

## Installation

  Install with the Node.JS package manager npm:

      $ npm install roomsjs
      $ npm install rooms.db

Download the front-end roomjs min file:
[https://raw.github.com/eladelrom/roomsjs-client/master/client/dist/libs/rooms.min.js](https://raw.github.com/eladelrom/roomsjs-client/master/client/dist/libs/rooms.min.js)

Or install with bower:

> bower install roomsjs-client

## Quick getting started example

create a project and install packages:

cd ~/dev
mkdir rooms && cd $_
npm install roomsjs rooms.db express

Server code to create the rooms, services and connect to database and/or 3rd party APIs for streaming;

<pre lang="javascript">
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
// OR for sockjs
// var server = require('http').createServer(app).listen(port, '0.0.0.0');

// services
roomdb.setServices('services_sample/', app); // pass the app to get rest services or null

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
</pre>

Rooms.db services examples:

<pre>
services_example/
  |- examples/
  |  |  |- cloudsearch.js [Cloud Search data source example]
  |  |  |- getitems.js [mySQL data source example]
  |  |  |- getnames.js [Static data example]
  |  |  |- insertchatmessage.js [Mongodb example]
</pre>

Front-end example of getting the number of visitors and data from external sources:

Examples of front-end implementation of `rooms` includes connecting to `engine.io`, `socket.io` and `sockjs` see here:

<pre>
client/
  |- examples/
  |  |  |- engineio
  |  |  |- socketio
  |  |  |- sockjs
  |  |  |- angular
</pre>

## Docs:

Below is a ten thousand foot diagram that shows how the different pieces of the platform are coming together using `socketio`.

![backend diagram](https://raw.github.com/eladelrom/poet/ei-pages/effectiveidea/public/images/roomsjs-diagram1.png)
<br><br>

See more information here about init concept read here: [http://effectiveidea.com/_posts/roomsjs](http://effectiveidea.com/_posts/roomsjs)
<br><br>

## LICENSE

BSD license.

