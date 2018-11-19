const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const TransactionSchema = new Schema({
    date: Date,
    type: String,
    reference: String,
    qty: Number,
    unitPrice: Number,
    blockNumber: String,
    txHash: String
  })

const InventorySchema = new Schema({
    sku: String,
    description: String,
    salePrice: Number,
    soh: Number,
    totalValue: Number,
    transactions: [TransactionSchema],
    owner: ObjectId
});

const dbInventoryItem = mongoose.model('inventory', InventorySchema, 'inventory');

module.exports = dbInventoryItem;