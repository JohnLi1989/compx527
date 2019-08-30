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

var schedule = require('node-schedule');
 

var rule = new schedule.RecurrenceRule(); 
rule.minute = [0,5,10,15,20,25,30,35,40,45,50,55];

var donelist = [];
var j = schedule.scheduleJob(rule, function(){  

  console.log("schedual task start");

  console.log(donelist)
  // Set the region 
  AWS.config.update({
      region: 'us-east-1',
      endpoint: undefined
    });

  //console.log(AWS.config)


  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "airquality";
  var s3 = new AWS.S3();


  var today = moment(new Date()).format("YYYY-MM-DD");

  console.log(today)

  var listparams = {
    Bucket : 'openaq-fetches',
    Prefix: 'realtime/'+today,
  }

  s3.listObjects(listparams, function(err, data) {
    if (err){
      console.log(err, err.stack); // an error occurred
    } else if(data.Contents.length == 0){
      console.log("no data right now");
    } else {
      let newone = data.Contents[data.Contents.length-1];
      console.log(newone.Key)
      let bucketParams = {
        Bucket : 'openaq-fetches',
        Key: newone.Key
      };
      var newnumber = parseInt(newone.Key.split('.')[0].split('/')[2])

      if(newnumber <= donelist[donelist.length-1]){
        console.log("already done", newnumber)
      } else {
        
        AWS.config.update({
          region: 'us-east-1',
          endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });

        s3.getObject(bucketParams, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            donelist.push(newnumber)
            
            var datalist = JSON.parse(JSON.stringify(data.Body.toString())).split(/\n/);

            console.log(datalist.length);

            for(let i=0; i<datalist.length-1; i++){
              //console.log(i)
              var jsondata = JSON.parse(datalist[i]);
              jsondata.date = parseInt(moment(jsondata.date.local).format("X"));
              var params = {
                  TableName:table,
                  Item: jsondata
              };
              //console.log(i,params)

              console.log("Adding a new item...");
              docClient.put(params, function(err, data) {
                  if (err) {
                      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                  } else {
                      console.log("Added item success");
                  }
                  sleep(1000);
              });
              
            }
            
          }
        });    
      }
    }    
  });


});

//var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


// Call S3 to obtain a list of the objects in the bucket

function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
  }
}
