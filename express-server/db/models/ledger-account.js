const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const TransactionSchema = new Schema({
    date: Date,
    type: String,
    transaction: String,
    amount: Number,
    reference: String,
    blockNumber: String,
    txHash: String
  })

const LedgerAccountSchema = new Schema({
    code: Number,
    forSKU: String,
    accountName: String,
    category: String,
    subCategory: String,
    description: String,
    debits: [TransactionSchema],
    credits: [TransactionSchema],
    owner: ObjectId
});

const dbLedgerAccount = mongoose.model('ledgerAccounts', LedgerAccountSchema, 'ledgerAccounts');

module.exports = dbLedgerAccount;