const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const {getUserIdFromEmail, getUserAvatarFromEmail, getUserEmailFromAuthId, getUserFromDisplayName, getAuthUser} = require('../controllers/user-controller')

module.exports = app => {
  app.get('/api/users/id/:email', getUserIdFromEmail)
  app.get('/api/users/avatar/:email', getUserAvatarFromEmail)  
  app.get('/api/users/email', ensureLoggedIn, getUserEmailFromAuthId)
  app.get('/api/users/user/:displayName', getUserFromDisplayName)
  app.get('/api/users/authUser', ensureLoggedIn, getAuthUser)
}