const express = require('express');
const router = express.Router();
const axios = require('axios');



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
  var city = encodeURI(req.query.city);
  axios.get('https://api.openaq.org/v1/latest?city='+city)
  .then(function (response) {
    // handle success
    res.json({results:response.data.results, city: decodeURI(city)});
    //console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
  
});

module.exports = router;
