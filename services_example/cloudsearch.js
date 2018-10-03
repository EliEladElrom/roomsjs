/*
Client side request can look like this:
var params = {
  requestParams : {
    rank : '-someField',
    'bq' : '(and%20item_1:1%20item_2:1)',
    'return-fields' : 'item_id,item_img&',
    'size' : '12',
    'start' : '0'
  },
  serverConfig : {
    apiVersion: '2011-02-01',
    domainName: '[your-cloud-search-domain-name]',
    region: 'us-east-1'
  }
};

serviceCall('cloudsearch', 'serviceCallbackRespond', params);
*/

'use strict';

var whiteListParams = {
  item_id : true,
  item_img : true,
  item_name : true
};

function cloudsearch(data, dbconnectorCallBackToRooms) {
  var endPoint = generateURL(data.params.requestParams, data.params.serverConfig);
  console.log(endPoint);

  var request = require("request");
  request(endPoint, function (error, response, body) {
    dbconnectorCallBackToRooms(data, body);
  });
}

function generateURL(params, serverConfig) {
  var retString = serverConfig.domainName + '.' + serverConfig.region + '.cloudsearch.amazonaws.com/2011-02-01/search?';

  for (var name in params) {
    if (whiteListParams.hasOwnProperty(name))
      retString = retString + name + '=' + params[name] + '&';
    else
      console.log('param ' + name + ' not on whitelist');
  }
  retString = retString.substring(0, retString.length-1);
  return retString;
}

module.exports.cloudsearch = cloudsearch;