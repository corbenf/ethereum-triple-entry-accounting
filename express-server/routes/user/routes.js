var mongoose = require('mongoose');
var User = require('../../db/models/user');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
    if(req.query.hexacc){query = {hexAccount:req.query.hexacc}}
    else(query = {})
    User.find(query).then(function(cust){
        res.send(cust);
    })
});

module.exports = router;