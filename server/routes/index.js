const express = require('express');
const router = express.Router();
const axios = require('axios');
const AWS = require("aws-sdk");
const moment = require("moment");

AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});






/* GET home page. */
router.get('/country', function(req, res, next) {
  axios.get('https://api.openaq.org/v1/countries?limit=1000')
  .then(function (response) {
    // handle success
    res.json({countries:response.data.results});
    //console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
});

router.get('/city', function(req, res, next) {
  country = req.query.country
  axios.get('https://api.openaq.org/v1/cities?country='+country)
  .then(function (response) {
    // handle success
    res.json({cities:response.data.results});
    //console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
});

router.get('/location', function(req, res, next) {
  city = encodeURI(req.query.city)
  axios.get('https://api.openaq.org/v1/locations?city='+city)
  .then(function (response) {
    // handle success
    res.json({locations:response.data.results});
    //console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
});


router.get('/detail', function(req, res, next) {
  var location = req.query.location;
  var hour = req.query.hour;
  //var city = "Central & Western"
  var docClient = new AWS.DynamoDB.DocumentClient();
  var now = moment(Date.now()).format("X");

  var table = "airquality";
  var params = {
    TableName : table,
    KeyConditionExpression : '#l = :location and #d between :t1 and :t2',  
    ExpressionAttributeValues : {
        ':location' : location,
        ':t2' : parseInt(moment(Date.now()).format("X")),
        ':t1' : parseInt(moment(Date.now()).format("X")) - hour*60*60
    },
    ExpressionAttributeNames: {"#l":"location", "#d":"date"}
  };
  
  docClient.query(params, function(err, data) {
    if (err) {
        res.json({
          message: "Unable to read item. Error JSON:" + JSON.stringify(err, null, 2),
          error: err
        });
        //console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        res.json({results:data});
        console.log("GetItem succeeded:", data);
    }
  });



  // axios.get('https://api.openaq.org/v1/latest?city='+city)
  // .then(function (response) {
  //   // handle success
  //   res.json({results:response.data.results, city: decodeURI(city)});
  //   //console.log(response.data);
  // })
  // .catch(function (error) {
  //   // handle error
  //   console.log(error);
  // });
  
});

module.exports = router;
