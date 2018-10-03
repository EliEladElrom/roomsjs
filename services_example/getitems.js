/*
 * Copyright 2013 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

// mySQL example

'use strict';

function VO(id, name) {
  this.id = id;
  this.name = name;
}

function getitems(data, dbconnectorCallBackToRooms) {
  var sqlString = "SELECT * FROM test.users WHERE name != ''";
  var connector = this.getConnector();
  connector.runSQLCommand(sqlString,
    function (rows) {
      var vo = new VO(rows[0].id, rows[0].name);
      dbconnectorCallBackToRooms(data, vo);
    });
}

module.exports.getitems = getitems;