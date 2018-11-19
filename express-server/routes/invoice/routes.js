var mongoose = require('mongoose');
var Invoice = require('../../db/models/invoice');
var User = require('../../db/models/user');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res){
    Invoice.create(req.body).then(function(invoice){
        User.findOneAndUpdate(
            {hexAccount:req.body.from},
            {$inc:{currentInvoiceNumber: 1}}
        ).then(function(num){
            res.send(invoice);
        })
    });
});

router.get('/all/:direction/:user', function(req, res){
    if(req.params.direction == 'from') query = {from: req.params.user}
    if(req.params.direction == 'to') query = {to: req.params.user}
    Invoice.find(query, function(err, docs){
        res.send(docs);
    });
});

router.put('/:bcIndex/update-state/:state', function(req, res){
    Invoice.findOneAndUpdate(
        {blockchainIndex: req.params.bcIndex},
        {state: req.params.state},
        function(result){
            res.send(result);
        }
    )
});

router.put('/:bcIndex/sign/:sig', function(req, res){
    Invoice.findOneAndUpdate(
        {blockchainIndex: req.params.bcIndex},
        {signature: req.params.sig},
        function(result){
            res.send(result);
        }
    )
});

module.exports = router;