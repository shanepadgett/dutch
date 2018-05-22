const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const {getReceipts} = require('../controllers/receipt-controller')

module.exports = app => {
  app.get('/dashboard', ensureLoggedIn, (req, res, _) => {
    res.render('dashboard', {
      user: req.user
    })
  })

  app.get('/receipts', ensureLoggedIn, (req, res, _) => {
    getReceipts(1).then(receipts => res.render('receipts', {receipts: JSON.stringify(receipts)}))
  })
}