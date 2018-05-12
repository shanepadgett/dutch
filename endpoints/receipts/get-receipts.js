const {getReceipts} = require('../../models/mock/receipt-mock')

module.exports = (_, res) => res.json(getReceipts())