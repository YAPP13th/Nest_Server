var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/aws/config.json');

var ec2 = new AWS.EC2();

/* GET home page. */
router.get('/', function(req, res, next) {
  ec2.describeInstances({}, function(err, data){
    if(!err){
      res.json(data);
    }else{
      res.json(err);
    }

  });
});

module.exports = router;
