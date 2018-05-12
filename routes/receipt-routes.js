const {getReceipt, getReceipts, postReceipt} = require('../controllers/receipt-controller')

module.exports = app => {
  app.get('/api/receipts/', getReceipts)
  app.get('/api/receipts/:receiptId', getReceipt)
  app.post('/api/receipts/', postReceipt)
}