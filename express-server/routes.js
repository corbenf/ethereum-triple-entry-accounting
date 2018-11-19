var inventoryRoutes = require('./routes/inventory/routes');
var invoiceRoutes = require('./routes/invoice/routes')
var userRoutes = require('./routes/user/routes')
var LedgerAccountRoutes = require('./routes/ledger-account/routes')

module.exports = function routes(expApp){
    expApp.use('/inventory', inventoryRoutes)
    expApp.use('/invoice', invoiceRoutes)
    expApp.use('/user', userRoutes)
    expApp.use('/ledger-account', LedgerAccountRoutes)
}