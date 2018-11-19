var mongoose = require('mongoose');
var InventoryItem = require('../../db/models/inventory');
var LedgerAccount = require('../../db/models/ledger-account');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    if(!req.query.sku) query={}
    if(req.query.sku) query = {sku:req.query.sku}
    InventoryItem.find(query).then(function(items){
        res.send(items);
    })
});

router.get('/all', function(req, res){
    query = {owner:req.query.owner}
    InventoryItem.find(query).then(function(items){
        res.send(items);
    }).catch(function(err){console.error(err)});
});

router.put('/sale/:sku', function(req, res){
    // Ugly. Surely this can be refactored.
    // Research MongoDB v4 transactions.
    if(req.params.sku>500){
    InventoryItem.findOneAndUpdate(
        {sku:req.params.sku}, 
        {
            $push: {transactions: req.body.transaction},
            $inc: {
                soh: -req.body.transaction[0].qty, 
                totalValue: -req.body.averageCost
            }
        }, 
        {new: true}).then(function(item){
            LedgerAccount.findOneAndUpdate(
                {$and: [{owner:req.body.owner},{forSku:req.params.sku},{category:"Revenue"}] },
                {
                    $push: {
                        credits: {
                            date:req.body.transaction[0].date,
                            type: 'INV',
                            transaction: req.body.to,
                            amount:(req.body.transaction[0].unitPrice*(req.body.transaction[0].qty)),
                            reference:req.body.transaction[0].reference,
                            blockNumber:req.body.transaction[0].blockNumber,
                            txHash:req.body.transaction[0].txHash
                        }
                    }
                },
                {new: true}
            ).then(function(ret){
                LedgerAccount.findOneAndUpdate(
                    {$and: [{owner:req.body.owner},{forSku:req.params.sku},{category:"Expenses"}] },
                    {
                        $push: {
                            debits: {
                                date:req.body.transaction[0].date,
                                type: 'INV',
                                transaction: req.body.to,
                                amount:req.body.averageCost,
                                reference:req.body.transaction[0].reference,
                                blockNumber:req.body.transaction[0].blockNumber,
                                txHash:req.body.transaction[0].txHash
                            }
                        }
                    },
                    {new: true}
                ).then(function(ret){
                    LedgerAccount.findOneAndUpdate(
                        {$and: [{owner:req.body.owner},{forSku:req.params.sku},{category:"Assets"}] },
                        {
                            $push: {
                                credits: {
                                    date:req.body.transaction[0].date,
                                    type: 'INV',
                                    transaction: req.body.to,
                                    amount:req.body.averageCost,
                                    reference:req.body.transaction[0].reference,
                                    blockNumber:req.body.transaction[0].blockNumber,
                                    txHash:req.body.transaction[0].txHash
                                }
                            }
                        },
                        {new: true}
                    ).then(function(ret){
                        res.send(ret);
                    }).catch(function(err){console.error(err)})
                }).catch(function(err){console.error(err)})
            }).catch(function(err){console.error(err)})
        }).catch(function(err){console.error(err)})
    }
});

router.put('/purchase/:sku', function(req, res){
    // To refactor...
    console.log(req.body)
    if(req.params.sku>500){
    InventoryItem.findOneAndUpdate(
        {sku:req.params.sku}, 
        {
            $push: {transactions: req.body.transaction},
            $inc: {
                soh: req.body.transaction[0].qty, 
                totalValue: req.body.transaction[0].qty*req.body.transaction[0].unitPrice
            }
        }, 
        {new: true}).then(function(item){
            LedgerAccount.findOneAndUpdate(
                {$and: [{owner:req.body.owner},{forSku:req.params.sku},{category:"Assets"}] },
                {
                    $push: {
                        debits: {
                            date:req.body.transaction[0].date,
                            type: 'INV',
                            transaction: req.body.from,
                            amount:req.body.transaction[0].qty*req.body.transaction[0].unitPrice,
                            reference:req.body.transaction[0].reference,
                            blockNumber:req.body.transaction[0].blockNumber,
                            txHash:req.body.transaction[0].txHash
                        }
                    }
                },
                {new: true}
            ).then(function(ret){
                res.send(ret);
            }).catch(function(err){console.error(err)})
        }).catch(function(err){console.error(err)})
    }
});

module.exports = router;