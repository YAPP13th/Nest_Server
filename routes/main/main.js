const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pg = require('pg');
const path = require('path');
const testGet = require('../../model/testQuery/testGet');
const testPost = require('../../model/testQuery/testPost');
const env = require('../../config/postgresql/env');

const fonniePool = new pg.Pool(env.fonnieConfig);

// var AWS = require('aws-sdk');
// AWS.config.loadFromPath('./config/aws/config.json');

// var ec2 = new AWS.EC2();

//메인모듈 api 작업 해야함.

router.post('/', function(req, res, next) {

  let name = req.body.name;

  fonniePool.connect((err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var check = testPost.testPost(client, name);

    check.then(function(result){
      done();
      return res.json(result);
    }).catch(function(err){
      res.status(err.status || 500);
      done();
      return res.send(err);
    });

  });

});

router.get('/', function(req, res, next) {

  fonniePool.connect((err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var check = testGet.testGet(client);

    check.then(function(result){
      done();
      return res.json(result);
    }).catch(function(err){
      res.status(err.status || 500);
      done();
      return res.send(err);
    });

  });

});

module.exports = router;
