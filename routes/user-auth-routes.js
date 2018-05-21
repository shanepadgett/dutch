const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()

module.exports = app => {
  app.get('/dashboard', ensureLoggedIn, (req, res, _) => {
    res.render('dashboard', {
      user: req.user
    })
  })

  app.get('/receipts', ensureLoggedIn, (req, res, _) => {
    res.render('receipts')
  })
}