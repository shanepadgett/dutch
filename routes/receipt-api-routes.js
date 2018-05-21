const {getReceipt, getReceipts, createReceipt} = require('../controllers/receipt-controller')
const {getItems} = require('../controllers/item-controller')

module.exports = app => {
  app.get('/api/receipts/:receiptId', getReceipt)
  app.get('/api/receipts/', getReceipts)
  app.get('/api/receipts/:receiptId/items', getItems)
  app.post('/api/receipts/', createReceipt)
}