const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pg = require('pg');
const path = require('path');
const check_user = require('../../model/loginQuery/check_user');
const sign_up = require('../../model/loginQuery/sign_up');
const env = require('../../config/postgresql/env');

const fonniePool = new pg.Pool(env.fonnieConfig);

// var AWS = require('aws-sdk');
// AWS.config.loadFromPath('./config/aws/config.json');

// var ec2 = new AWS.EC2();

router.post('/', function(req, res, next) {

  let data = {
    'id' : req.body.id,
    'date' : req.body.date
  };

  if(data.id === '' || data.date === ''){
    return res.json({success: false, status: 3000});
  }

  fonniePool.connect((err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, status: 5000});
    }

    var check = check_user.check_user(client, data);

    check.then(function(result){
      done();
      return res.json(result);
    }).catch(function(err){
      res.status(err.status || 500);
      done();
      return res.json({success: false, status: 5000});
    });

  });

});

router.post('/join', function(req, res, next) {

  let data = {
    'id' : req.body.id,
    'now_date' : req.body.now_date,
    'name' : req.body.name,
    'gender' : req.body.gender,
    'year' : req.body.year,
    'monthly' : req.body.monthly,
    'room' : req.body.room,
    'location' : req.body.location,
    'pattern' : req.body.pattern,
    'drink' : req.body.drink,
    'smoking' : req.body.smoking,
    'allow_friend' : req.body.allow_friend,
    'pet' : req.body.pet,
    'like' : req.body.like,
    'hate' : req.body.hate,
    'introduce' : req.body.introduce
  }

  if(data.id === '' || data.now_date === '' || data.name === '' || data.gender === ''
  || data.year === '' || data.monthly === '' || data.room === '' || data.location === ''){
    return res.json({success: false, status: 3000});
  }

  fonniePool.connect((err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, status: 5000});
    }

    var check = sign_up.sign_up(client, data);

    check.then(function(result){
      done();
      return res.json(result);
    }).catch(function(err){
      res.status(err.status || 500);
      done();
      return res.json({success: false, status: 5000});
    });

  });

});

module.exports = router;
