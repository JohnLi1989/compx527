const express = require('express');
const router = express.Router();
const axios = require('axios');
const AWS = require("aws-sdk");

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


router.get('/detail', function(req, res, next) {
  //var city = encodeURI(req.query.city);
  var city = "Central & Western"
  var docClient = new AWS.DynamoDB.DocumentClient();

  var table = "airquality";

  var params = {
      TableName: table,
      Key:{
          "city": city,
      }
  };
  docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        res.json({results:data, city: decodeURI(city)});
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
