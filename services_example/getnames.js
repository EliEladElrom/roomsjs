/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

// exmaple of just sending a static data we created

'use strict';

function getnames(data, dbconnectorCallBackToRooms) {
  var vo = ['Liam', 'Samuel', 'Noah'];
  dbconnectorCallBackToRooms(data, vo);
}

module.exports.getnames = getnames;