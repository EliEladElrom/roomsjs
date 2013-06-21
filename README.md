# roomsjs - streaming live data built to support different transporters

[![Build Status](https://secure.travis-ci.org/EladElrom/roomsjs-client.png)](http://travis-ci.org/EladElrom/roomsjs-client)
[![NPM version](https://badge.fury.io/js/roomsjs.png)](http://badge.fury.io/js/roomsjs)

A Javascript Node.JS module, provides an object oriented wrapper for different transporters for creating rooms and streaming data between users, streaming data from a database and even other CDNs.
`roomsjs`, `roomsdb` and `roomsjs-client` together combine a powerful light-weight backend/front-end libraries built to stream live data and solve same problems related to realtime communications, stream data from a database and even stream 3rd party APIs.

It has features such as:

    1. Connect to a room
    2. Register a user
    2. Request number of users
    3. Private message
    4. Video
    5. Create multiple rooms
    6. Store states.
    7. Subscribe to data VO.
    8. AMS Flash Webcam fallback
    9. HTML5 Webcam
    10. Database connector (such as mysql)

## Installation

  Install with the Node.JS package manager [npm](http://travis-ci.org/EladElrom/roomsjs-client):

      $ npm install roomsjs
      $ npm install rooms.db

Download the front-end min file:
[https://raw.github.com/EladElrom/roomsjs-client/master/public/js/libs/socketcontroller.min.js](https://raw.github.com/EladElrom/roomsjs-client/master/public/js/socketcontroller.min.js)

Example of front-end implementation of `socketcontroller`:
[https://raw.github.com/EladElrom/roomsjs-client/master/client/js/autostartcontroller.js](https://raw.github.com/EladElrom/roomsjs-client/master/public/js/autostartcontroller.js)

Front-end dependencies: `jquery.js`, transporter such as `socket.io.js`

Download complete front-end example from here see `client` folder:
[https://github.com/EladElrom/roomsjs-client](https://github.com/EladElrom/roomsjs-client)

## Example

Back-end code to create the rooms services and connect to database and/or 3rd party APIs for streaming;

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

Front-end example of getting the number of visitors:

<pre lang="html">
<code>
&#60;html&#62;
&#60;head&#62;
    &#60;script type="text/javascript" src="js/libs/jquery.min.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="js/libs/jquery-ui.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/socket.io/socket.io.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/libs/socketcontroller.min.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/autostartcontroller.js"&#62;&#60;/script&#62;
&#60;body&#62;
    &#60;button id="getResultsButton"&#62;Get results&#60;/button&#62;
    &#60;div id="visitors" /&#62;
&#60;/body&#62;
&#60;/html&#62;
</code>
</pre>

Example of streaming a pod consists of live camera feeds and text comment feed between different users on a page and dragging the pods;

<pre lang="html"><code>
&#60;html&#62;
&#60;head&#62;
    &#60;script type="text/javascript" src="js/libs/jquery.min.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="js/libs/jquery-ui.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/socket.io/socket.io.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/libs/socketcontroller.min.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/controller.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/model/vo/clientvo.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/libs/swfobject.js"&#62;&#60;/script&#62;
&#60;body&#62;

&#60;div class="well" style="float: right; width: 300px; height: 300px; border: 1px solid #999;"&#62;
    Click to start/stop dragging
    &#60;button id="grabAllPodsButton"&#62;Grab all pods&#60;/button&#62;
&#60;/div&#62;

&#60;div id="visitors" /&#62;

&#60;/body&#62;
&#60;/html&#62;
</code></pre>

## Docs:

Below is a ten thousand foot diagram that shows how the different pieces of the platform are coming together.

![backend diagram](https://raw.github.com/EladElrom/poet/ei-pages/effectiveidea/public/images/roomsjs-diagram1.png)
<br><br>

See more information here about init concept read here: [http://effectiveidea.com/_posts/roomsjs](http://effectiveidea.com/_posts/roomsjs)
<br><br>

## LICENSE

BSD license.

