'use strict';

/*
 * Copyright 2020 Elad Elrom, All Rights Reserved.
 * Code licensed under the BSD License:
 * @author Elad Elrom <elad.ny...gmail.com>
 */

// postgres example
// http://localhost:8081/getId

'use strict';

function VO(id, user_id) {
  this.id = id;
  this.user_id = user_id;
}

function get_topics(data, dbconnectorCallBackToRooms) {
  let sqlString = "SELECT * FROM public.tableName ORDER BY id ASC, user_id ASC LIMIT 1";
  let connector = this.getConnector();
  let vo
  connector.runSQLCommand(sqlString,
    function (results, err) {
      if (err) {
        console.error(err);
        return;
      }
      vo = new VO(results.rows['0'].id, results.rows['0'].user_id);
      dbconnectorCallBackToRooms(data, vo);
    });
}

module.exports.get_topics = get_topics;
