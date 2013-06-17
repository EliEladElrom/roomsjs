# JavaScript Node.JS module for creating rooms and streaming data between front-end and back-end 

A Node.JS module, provides an object oriented wrapper for socketio for creating rooms and streaming data between users, streaming data from a database and even 3rd party services.
`roomsjs` based on Socket.IO, `roomsdb` and `roomsjs-fronend` combine together provides a powerful light-weight backend/front-end libraries built to stream live data, stream data from a database and even stream 3rd party APIs.

It has features such as:

    1. Connect to a room
    2. Register a user
    2. Request number of users
    3. Private message
    4. Video
    5. Create multiple rooms
    6. Store states.
    7. Subscribe to data VO.
    8. AMS Webcam
    9. HTML5 Webcam
    10. Database connector (mysql)

## Installation

  Install with the Node.JS package manager [npm](http://npmjs.org/):

      $ npm install roomsjs
      $ npm install rooms.db

Download the front-end code from:

[https://raw.github.com/EladElrom/roomsjs-fronend/master/public/js/enum/messagetype.js.js](https://raw.github.com/EladElrom/roomsjs-fronend/master/public/js/enum/messagetype.js)
[https://raw.github.com/EladElrom/roomsjs-fronend/master/public/js/socketcontroller.js](https://raw.github.com/EladElrom/roomsjs-fronend/master/public/js/socketcontroller.js)
[https://raw.github.com/EladElrom/roomsjs-fronend/master/public/js/autostartcontroller.js](https://raw.github.com/EladElrom/roomsjs-fronend/master/public/js/autostartcontroller.js)

Front-end dependencies: `jquery.js`, `socket.io.js`

Download complete front-end example from here see `public` folder: 
[https://github.com/EladElrom/roomsjs-fronend](https://github.com/EladElrom/roomsjs-fronend)
      
## Example

Back-end code to create the rooms services and connect to database and/or 3rd party APIs for streaming;

<pre lang="javascript"><code>
var express     = require('express'),
    app         = express(),
    os          = require('os'),
    http        = require('http'),
    server      = http.createServer(app),
    rooms       = require('roomsjs'),
    dbconnector = require('rooms.db'),
    db_methods  = require('./roomsdb_sample/dbconnector_methods.js'),
    port        = (process.env.PORT || 8081);

app.use(express.static(__dirname + '/public'));

server.listen(port, function() {
    console.log('Listening on http://' + os.hostname() + ':' + port);
});

dbconnector.connectToDatabase('mysql', 'localhost', 'root', '');
db_methods.setMethods(dbconnector);

rooms = new rooms({ server : server, isdebug : true, socketio : null, dbconnector : dbconnector });
</code></pre>

Front-end example of getting the number of visitors:

<pre lang="html">
<code>
&#60;html&#62;
&#60;head&#62;
    &#60;title&#62;Room controller&#60;/title&#62;

    &#60;script type="text/javascript" src="js/libs/jquery.min.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="js/libs/jquery-ui.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/socket.io/socket.io.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/enums/messagetype.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/socketcontroller.js"&#62;&#60;/script&#62;
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
    &#60;title&#62;Room controller&#60;/title&#62;

    &#60;script type="text/javascript" src="js/libs/jquery.min.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="js/libs/jquery-ui.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/socket.io/socket.io.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/enums/messagetype.js"&#62;&#60;/script&#62;
    &#60;script type="text/javascript" src="/js/socketcontroller.js"&#62;&#60;/script&#62;
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

See more information here: [http://effectiveidea.com/_posts/roomsjs](http://effectiveidea.com/_posts/roomsjs)
<br><br>

## LICENSE

BSD license.

