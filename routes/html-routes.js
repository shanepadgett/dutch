const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const {getReceipts} = require('../controllers/receipt-controller')
const {getItemsByAssignee} = require('../controllers/item-controller')

module.exports = app => {
  app.get('/', (_, res) => {
    res.render('index')
  })

  app.get('/dashboard', ensureLoggedIn, (req, res) => {
    getItemsByAssignee(req.user.id).then(items => {
      console.log(items)
      res.render('dashboard', {
        user: req.user,
        items: items
      })
    })
  })

  app.get('/receipts', ensureLoggedIn, (req, res) => {
    getReceipts(1).then(receipts => res.render('receipts', {receipts: JSON.stringify(receipts)}))
  })
}
