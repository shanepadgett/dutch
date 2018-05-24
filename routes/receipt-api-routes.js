const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const {createReceipt, getReceipts} = require('../controllers/receipt-controller')

module.exports = app => {
  app.get('/api/authUser/receipts/', ensureLoggedIn, getReceipts)
  app.post('/api/receipts/', createReceipt)
}