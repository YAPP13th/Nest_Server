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

var isEmpty = function(value){
  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    return true;
  }else{
    return false
  }
};

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

router.get('/test', function(req, res, next) {

  let query = 'SELECT * FROM userInfo WHERE ';
  let data = {
    'minYear' : '1994',
    'maxYear' : '1990',
    'monthly' : '50',
    'room' : false,
    'location' : '서울특별시 강남구 선릉로',
    'pattern' : '',
    'drink' : '',
    'smoking' : '',
    'allow_friend' : '',
    'pet' : 'yes'
  }

  for(var key in data){

    if(key == 'minYear'){
      if(!isEmpty(data[key])){
        query = query + key + ' > ' + data[key] + ' AND ';
      }
    }else if(key == 'maxYear'){
      if(!isEmpty(data[key])){
        query = query + key + ' < ' + data[key] + ' AND ';
      }
    }else{
      if(!isEmpty(data[key])){
        query = query + key + ' = ' + data[key] + ' AND ';
      }
    }

  }

  query = query.substring(0, query.length - 5);

  return res.send(query);

});

module.exports = router;
