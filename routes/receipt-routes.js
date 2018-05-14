const {getReceipt, getReceipts, createReceipt} = require('../controllers/receipt-controller')

module.exports = app => {
  app.get('/api/receipts/:receiptId', getReceipt)
  app.get('/api/receipts/', getReceipts)
  app.post('/api/receipts/', createReceipt)
}