const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    streetAddress: {
        street: String,
        suburb: String,
        city: String,
        postCode: String
    },
    phoneNumber: String,
    emailAddress: String,
    webSiteAddress: String,
    gstNumber: String,
    hexAccount: String,
    invoiceStyleColor: String,
    currentInvoiceNumber: Number
  });

const dbUser = mongoose.model('users', UserSchema, 'users');

module.exports = dbUser;