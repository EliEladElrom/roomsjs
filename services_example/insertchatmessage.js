/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

// Mongodb example

'use strict';

function insertchatmessage(data, dbconnectorCallBackToRooms) {
  var connector = this.getConnector(),
    Chat;

  if (connector.isModelExists('Chat')) {
    Chat = connector.getModel('Chat');
  } else {
    var schema = connector.setSchema({
      chatMessage: 'string',
      roomId: 'Number',
      gravatar: 'string',
      email: 'string',
      userName: 'string'
    });
    Chat = connector.setModel('Chat', schema);
  }

  var chatMessage = new Chat({
    chatMessage: data.params.chatMessage,
    roomId: data.params.roomId,
    gravatar: data.params.gravatar,
    email: data.params.email,
    userName: data.params.userName
  });

  chatMessage.save(function (err) {
    if (err) {
      console.log('error' + err.message);
    } else {
      Chat.find(function (err, messages) {
        if (err) {
          console.log('error getting messages: ' + err.message);
        }
        dbconnectorCallBackToRooms(data, messages);
      });
    }
  });
}

module.exports.insertchatmessage = insertchatmessage;