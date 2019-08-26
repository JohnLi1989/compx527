/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/

//snippet-sourcedescription:[s3_listobjects.js demonstrates how to list the objects in an Amazon S3 bucket.]
//snippet-service:[s3]
//snippet-keyword:[JavaScript]
//snippet-keyword:[Code Sample]
//snippet-keyword:[Amazon S3]
//snippet-sourcetype:[full-example]
//snippet-sourcedate:[2018-06-02]
//snippet-sourceauthor:[AWS-JSDG]

// ABOUT THIS NODE.JS SAMPLE: This sample is part of the SDK for JavaScript Developer Guide topic at
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html

// snippet-start:[s3.JavaScript.buckets.listObjects]
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var moment = require('moment');
// Set the region 
AWS.config.update({
    region: 'us-east-1',
    //endpoint: "https://dynamodb.us-east-1.amazonaws.com"
  });

// Create S3 service object
s3 = new AWS.S3();

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket : 'openaq-fetches',
  Key: 'realtime/2019-08-25/1566723665.ndjson'
};

var docClient = new AWS.DynamoDB.DocumentClient();
//var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var table = "airquality";


// Call S3 to obtain a list of the objects in the bucket
s3.getObject(bucketParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    AWS.config.update({
      region: 'us-east-1',
      endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });
    var datalist = JSON.parse(JSON.stringify(data.Body.toString())).split(/\n/);

    for(let i=0; i<datalist.length-1; i++){
      //console.log(i)
      var jsondata = JSON.parse(datalist[i]);
      jsondata.date = parseInt(moment(jsondata.date.local).format("X"));
      var params = {
          TableName:table,
          Item: jsondata
      };
      console.log("Adding a new item...");
      docClient.put(params, function(err, data) {
          if (err) {
              console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("Added item success");
          }
      });
      
    }

    
    
  }
});


// var AWS = require("aws-sdk");

// AWS.config.update({
//   region: "us-east-1",
//   endpoint: "https://dynamodb.us-east-1.amazonaws.com"
// });

// var docClient = new AWS.DynamoDB.DocumentClient();

// var table = "airquality";

// var data = {"date":{"utc":"2019-08-20T02:00:00.000Z","local":"2019-08-20T10:00:00+08:00"},"parameter":"no2","value":35.8,"unit":"µg/m³","averagingPeriod":{"value":1,"unit":"hours"},"location":"Central/Western","city":"Central & Western","country":"HK","coordinates":{"longitude":114.14444444444445,"latitude":22.285},"attribution":[{"name":"Environmental Protection Department","url":"https://data.gov.hk/en-data/dataset/hk-epd-airteam-past24hr-pc-of-individual-air-quality-monitoring-stations"}],"sourceName":"Hong Kong","sourceType":"government","mobile":false}

// var params = {
//     TableName:table,
//     Item: data
// };

// console.log("Adding a new item...");
// docClient.put(params, function(err, data) {
//     if (err) {
//         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Added item:", JSON.stringify(data, null, 2));
//     }
// });

// { date:
//   { utc: '2019-08-25T08:30:00.000Z',
//     local: '2019-08-25T14:00:00+05:30' },
//  parameter: 'o3',
//  value: 27.28,
//  unit: 'µg/m³',
//  averagingPeriod: { unit: 'hours', value: 0.25 },
//  location: 'Rabindra Sarobar, Kolkata - WBPCB',
//  city: 'Kolkata',
//  country: 'IN',
//  coordinates: { latitude: 22.51106, longitude: 88.35142 },
//  attribution:
//   [ { name: 'Central Pollution Control Board',
//       url:
//        'https://app.cpcbccr.com/ccr/#/caaqm-dashboard-all/caaqm-landing' } ],
//  sourceName: 'caaqm',
//  sourceType: 'government',
//  mobile: false }