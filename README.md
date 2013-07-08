# roomsjs - streaming live data built to support different transporters

[![Build Status](https://secure.travis-ci.org/eladelrom/roomsjs-client.png)](http://travis-ci.org/eladelrom/roomsjs-client)
[![NPM version](https://badge.fury.io/js/roomsjs.png)](http://badge.fury.io/js/roomsjs)

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
    10. Database connector (such as mysql).
    11. Switch different transporters: currently supporting `socket.io`, `engine.io` and `SockJS`.

## Installation

  Install with the Node.JS package manager npm:

      $ npm install roomsjs
      $ npm install rooms.db

Download the front-end roomjs min file:
[https://raw.github.com/eladelrom/roomsjs-client/master/client/dist/libs/rooms.min.js](https://raw.github.com/eladelrom/roomsjs-client/master/client/dist/libs/rooms.min.js)

or using bower:

> bower install roomsjs-client

## Example

Server code to create the rooms, services and connect to database and/or 3rd party APIs for streaming;

<pre lang="javascript"><code>
var os          = require('os'),
    rooms       = require('roomsjs'),
    roomdb      = require('rooms.db'),
    port        = (process.env.PORT || 8081);

// create express server if needed
var express     = require('express'),
    app         = express().use(express.static(__dirname + '/client'));

// create server
var server = require('http').createServer(app).listen(port, function () {
        console.log('Listening on http://' + os.hostname() + ':' + port);
    });

// services
roomdb.setServices('services_sample/');
// connect database/s if needed
roomdb.connectToDatabase('mysql', 'localhost', 'root', '');

// set rooms
rooms = new rooms({
    isdebug : true,
    transporter : {
        type: 'socket.io',
        server : server
    },
    roomdb : roomdb /* or null */
});
</code></pre>

To set `engine.io` as the transporter use:

<pre lang="javascript">
      rooms = new rooms({
          isdebug : true,
          transporter : {
              type: 'engine.io',
              server : server
          },
          roomdb : roomdb
      });
</pre>

To set `sockjs` as the transporter, just add `0.0.0.0` to server listener and use `sockjs` as the transporter type;

<pre lang="javascript">
var os          = require('os'),
    rooms       = require('roomsjs'),
    roomdb      = require('rooms.db'),
    port        = (process.env.PORT || 8081);

// create express server if needed
var express     = require('express'),
    app         = express().use(express.static(__dirname + '/client'));

// create server
var server = require('http').createServer(app).listen(port, '0.0.0.0');

// services
roomdb.setServices('services_sample/');
// connect database/s if needed
roomdb.connectToDatabase('mysql', 'localhost', 'root', '');

// set rooms
rooms = new rooms({
    isdebug : true,
    transporter : {
        type: 'sockjs',
        server : server
    },
    roomdb : roomdb /* or null */
});
</pre>

Front-end example of getting the number of visitors and data from external sources:

Examples of front-end implementation of `rooms` includes connecting to `engine.io`, `socket.io` and `sockjs` see here:

<pre>
client/examples/engineio
                socketio
                sockjs

</pre>

## Docs:

Below is a ten thousand foot diagram that shows how the different pieces of the platform are coming together.

![backend diagram](https://raw.github.com/eladelrom/poet/ei-pages/effectiveidea/public/images/roomsjs-diagram1.png)
<br><br>

See more information here about init concept read here: [http://effectiveidea.com/_posts/roomsjs](http://effectiveidea.com/_posts/roomsjs)
<br><br>

## LICENSE

BSD license.

