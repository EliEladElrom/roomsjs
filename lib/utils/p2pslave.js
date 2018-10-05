/*
 * Copyright 2018 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

let Swarm = require('discovery-swarm'),
    defaults = require('dat-swarm-defaults'),
    getPort = require('get-port'),
    peers = {},
    messagetype = require('../enums/messagetype.js'),
    counterforConnections = 0,
    myPeerId,
    roomsMasterPeerId = Buffer.from('548e09f70356a1237594fbe489e33684', 'hex'),
    channel,
    peerType,
    PEER_MASTER = 'master',
    PEER_SLAVE = 'slave';

let initPeer = (channelName, type, peerId) => {

    myPeerId = peerId;
    channel = channelName;
    peerType = type;

    let config = defaults({
        id: myPeerId,
    });
    let swarm = Swarm(config);

    (async () => {
        let randomUnusedPortToListenToTCPPeerConnections = await getPort();

        console.log('type: ' + peerType + ', myPeerId: ' + myPeerId.toString('hex') + ', channel: ' + channelName + ', port: ' + randomUnusedPortToListenToTCPPeerConnections);

        swarm.listen(randomUnusedPortToListenToTCPPeerConnections);
        swarm.join(channel);

        swarm.on('connection', (conn, info) => {
            let seq = counterforConnections,
                checkSlavePeerId = info.id.toString('hex');

            console.log(`Slave Connected #${seq} to peer: ${checkSlavePeerId}`);

            // Keep peer alive
            if (info.initiator) {
                try {
                    conn.setKeepAlive(true, 600);
                } catch (exception) {
                    console.log('exception', exception);
                }
            }

            conn.on('data', data => {
                let message = JSON.parse(data);
                console.log('my peer: ' + myPeerId.toString('hex'));
                if (message.to === myPeerId.toString('hex')) {
                    routeMessages(message);
                }
            });

            conn.on('close', () => {
                console.log(`Slave Connection ${seq} closed, peer id: ${checkSlavePeerId}`);
                // If last connection delete
                if (peers[checkSlavePeerId].seq === seq) {
                    delete peers[checkSlavePeerId]
                }
            });

            // Save connection
            if (!peers[checkSlavePeerId]) {
                peers[checkSlavePeerId] = {}
            }
            peers[checkSlavePeerId].conn = conn;
            peers[checkSlavePeerId].seq = seq;
            counterforConnections++

        })
    })();
};

writeMessage = (message) => {
    let peerIdHex = roomsMasterPeerId.toString('hex');
    if (peers && peers.hasOwnProperty(peerIdHex)) {
        console.log('message to roomjs to peer: ' + peerIdHex);
        peers[peerIdHex].conn.write(JSON.stringify(message));
    } else {
        console.log('No roomsjs master peer found make sure roomsjs is running');
    }
};

routeMessages = (message) => {
    switch(message.type) {
        case messagetype.STATE_CHANGE:
            console.log('--- Handle STATE_CHANGE --- ' + JSON.stringify(message));
            break;
        case messagetype.STORE_STATE:
            console.log('--- Handle STORE_STATE --- ' + JSON.stringify(message));
            break;
    }
};

function exitHandler(options, exitCode) {
    writeMessage({
        type: messagetype.DISCONNECT,
        data: {
            'userId' : myPeerId.toString('hex')
        }
    });
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

if (typeof exports != 'undefined' ) {
    exports.initPeer = initPeer;
    exports.writeMessage = writeMessage;
    exports.PEER_SLAVE = PEER_SLAVE;
    exports.PEER_MASTER = PEER_MASTER;
}

