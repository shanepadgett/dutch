const {getReceipt} = require('../../models/mock/receipt-mock')

module.exports = ({params: {receiptId}}, res) => res.json(getReceipt(parseInt(receiptId)))