var mongoose = require('mongoose');
var LedgerAccount = require('../../db/models/ledger-account');
var express = require('express');
var router = express.Router();

router.get('/all', function(req, res){
    LedgerAccount.find(
        {owner:req.query.owner}
    ).then(function(data){
        res.send(data);
    })
});

router.put('/addentry/:owner/:acc/:type', function(req, res){
    if(req.params.type == 'dr'){
        LedgerAccount.findOneAndUpdate(
            {$and: [{owner:req.params.owner},{code:req.params.acc}] },
            {$push: {debits: req.body.details}},
            {new: true}
        ).then(function(ret){
            res.send(ret);
        }).catch(function(err){console.error(err)});
    } else {
        LedgerAccount.findOneAndUpdate(
            {$and: [{owner:req.params.owner},{code:req.params.acc}] },
            {$push: {credits: req.body.details}},
            {new: true}
        ).then(function(ret){
            res.send(ret);
        }).catch(function(err){console.error(err)});
    }
})

router.put('/pay-invoice', function(req, res){
    // and then and then and then... Ugly
    LedgerAccount.findOneAndUpdate(
        {$and:[{owner:req.body.userId},{code:800}]},
        {$push: {
            debits: {
                date: req.body.data.date,
                type: req.body.data.type,
                transaction: req.body.data.transaction[0],
                amount: req.body.data.amount,
                reference: req.body.data.reference[0],
                blockNumber: req.body.data.blockNumber,
                txHash: req.body.data.txHash
            }
        }}
    ).then(function(ret){

        LedgerAccount.findOneAndUpdate(
            {$and:[{owner:req.body.userId},{code:100}]},
            {$push: {
                credits: {
                    date: req.body.data.date,
                    type: req.body.data.type,
                    transaction: req.body.data.transaction[0],
                    amount: req.body.data.amount,
                    reference: req.body.data.reference[0],
                    blockNumber: req.body.data.blockNumber,
                    txHash: req.body.data.txHash
                }
            }
            }
        ).then(function(ret){

            LedgerAccount.findOneAndUpdate(
                {$and:[{owner:req.body.supplier},{code:610}]},
                {$push: {
                    credits: {
                        date: req.body.data.date,
                        type: req.body.data.type,
                        transaction: req.body.data.transaction[1],
                        amount: req.body.data.amount,
                        reference: req.body.data.reference[1],
                        blockNumber: req.body.data.blockNumber,
                        txHash: req.body.data.txHash
                    }
                }}
            ).then(function(ret){
                
                LedgerAccount.findOneAndUpdate(
                    {$and:[{owner:req.body.supplier},{code:100}]},
                    {$push: {
                        debits: {
                            date: req.body.data.date,
                            type: req.body.data.type,
                            transaction: req.body.data.transaction[1],
                            amount: req.body.data.amount,
                            reference: req.body.data.reference[1],
                            blockNumber: req.body.data.blockNumber,
                            txHash: req.body.data.txHash
                        }
                    }}
                ).then(function(ret){
                    res.send(ret);
                }).catch(function(err){console.error(err)});

            }).catch(function(err){console.error(err)});

        }).catch(function(err){console.error(err)});

    }).catch(function(err){console.error(err)});
});

module.exports = router;