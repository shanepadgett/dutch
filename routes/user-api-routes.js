const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const {getUserIdFromEmail, getUserAvatarFromEmail, getUserEmailFromAuthId} = require('../controllers/user-controller')

module.exports = app => {
  app.get('/api/users/id/:email', getUserIdFromEmail)
  app.get('/api/users/avatar/:email', getUserAvatarFromEmail)  
  app.get('/api/users/email', ensureLoggedIn, getUserEmailFromAuthId)
}