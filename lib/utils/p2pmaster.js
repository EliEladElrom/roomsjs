/*
 * Copyright 2018 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */
let crypto = require('crypto'),
    Swarm = require('discovery-swarm'),
    defaults = require('dat-swarm-defaults'),
    getPort = require('get-port'),
    basketutil =  require('./basketutil.js'),
    peers = {},
    counterforConnections = 0,
    masterPeerId = Buffer.from('548e09f70356a1237594fbe489e33684', 'hex'),
    channel,
    peerType,
    PEER_MASTER = 'master',
    PEER_SLAVE = 'slave',
    roomsCallbackFromP2P;

let initP2PMasterServer = (channelName, type, callback) => {

    roomsCallbackFromP2P = callback;
    channel = channelName;
    peerType = type;

    let config = defaults({
        id: masterPeerId,
    });
    let swarm = Swarm(config);

    (async () => {
        let randomUnusedPortToListenToTCPPeerConnections = await getPort();

        basketutil.log('type: ' + peerType + ', masterPeerId: ' + masterPeerId.toString('hex') + ', channel: ' + channelName + ', port: ' + randomUnusedPortToListenToTCPPeerConnections);

        swarm.listen(randomUnusedPortToListenToTCPPeerConnections);
        swarm.join(channel);

        swarm.on('connection', (conn, info) => {
            let seq = counterforConnections,
                checkMasterPeerId = info.id.toString('hex');

            basketutil.log(`Master Connected #${seq} to peer: ${checkMasterPeerId}`);

            // Keep peer alive
            if (info.initiator) {
                try {
                    conn.setKeepAlive(true, 600);
                } catch (exception) {
                    basketutil.log('exception', exception);
                }
            }

            conn.on('data', data => {
                basketutil.log('From: ' + checkMasterPeerId);
                let mPeerId = masterPeerId.toString('hex');
                if (checkMasterPeerId == mPeerId) {
                    basketutil.log('ignore messages sent by myself');
                }
                basketutil.log('From: ' + checkMasterPeerId);
                basketutil.log('Received message' + Buffer.from(data, 'hex'));
                let message = JSON.parse(data);
                roomsCallbackFromP2P(checkMasterPeerId, message.type, message.data);
            });

            conn.on('close', () => {
                basketutil.log(`Master Connection ${seq} closed, peer id: ${checkMasterPeerId}`);
                // If last connection delete
                if (peers[checkMasterPeerId].seq === seq) {
                    delete peers[checkMasterPeerId]
                }
            });

            // Save connection
            if (!peers[checkMasterPeerId]) {
                peers[checkMasterPeerId] = {}
            }
            peers[checkMasterPeerId].conn = conn;
            peers[checkMasterPeerId].seq = seq;
            counterforConnections++

        })
    })();
};

sendMessageToAllPeersExceptFromPeerId = (msg, fromId) => {
    basketutil.log('sendMessageToAllPeersExceptFromPeerId :: ' + msg);
    for (let id in peers) {
        if (id !== fromId)
            peers[id].conn.write('MsgFrom: ' + fromId + ', msg:' + msg);
    }
};

writeMessageToPeer = (toUserId, type, data) => {
    basketutil.log('sendMessageToAllPeersExceptFromPeerId :: type: ' + type + ', to: ' + toUserId);
    for (let id in peers) {
        if (id == toUserId) {
            console.log('-------- send message -------- ');
            console.log('message to roomjs peer: ' + id);
            peers[id].conn.write(JSON.stringify(
                {
                    to: toUserId,
                    type: type,
                    data: data
                }
            ));
        }
    }
};

function exitHandler(options, exitCode) {
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
    exports.initP2PMasterServer = initP2PMasterServer;
    exports.PEER_SLAVE = PEER_SLAVE;
    exports.PEER_MASTER = PEER_MASTER;
    exports.roomsCallbackFromP2P = roomsCallbackFromP2P;
    exports.writeMessageToPeer = writeMessageToPeer;
}