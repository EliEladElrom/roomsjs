/*
Example:
curl -i -d "param1=value1&param2=value2" http://localhost:8081/post_example
 */
'use strict';

let connector,
    params;

function post_example(data, dbconnectorCallBackToRooms) {

    logger.info('---------- post_example.js ----------');
    connector = this.getConnector();
    params = data.query || data.params;

    console.log('params: ' + JSON.stringify(params));

    if (!params) {
        dbconnectorCallBackToRooms(data, {status: 'error', error_message: 'error', params: {}});
    } else {
        dbconnectorCallBackToRooms(data, {status: 'success', params: params});
    }

}

module.exports.post_example = post_example;
