const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create invoice Schema and Model
const InvoiceSchema = new Schema({
    number: String,
    issueDate: Date,
    to: String,
    from: String,
    dueDate: Date,
    reference: String,
    lines: [{
      sku: String,
      name: String,
      unitCost: Number,
      qty: Number,
      discount: Number,
      lineTotal: Number
    }],
    subTotal: Number,
    GST: Number,
    grandTotal: Number,
    signature: String,
    state: String,
    blockchainIndex: String,
    blockNumber: String,
    txHash: String
  });

const dbInvoice = mongoose.model('invoices', InvoiceSchema);

module.exports = dbInvoice;