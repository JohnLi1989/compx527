const express = require('express');
const router = express.Router();
const axios = require('axios');



/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('https://api.openaq.org/v1/countries?limit=1000')
  .then(function (response) {
    // handle success
    res.render('index', {cities:response.data.results});
    //console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
  
});


router.get('/:city', function(req, res, next) {
  var city = req.params.city;
  console.log(city);
  axios.get('https://api.openaq.org/v1/latest?city='+city)
  .then(function (response) {
    // handle success
    res.render('city', {results:response.data.results, city: city});
    //console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
  
});

module.exports = router;
