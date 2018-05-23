const {getUserIdFromEmail, getUserAvatarFromEmail, getUserFromDisplayName} = require('../controllers/user-controller')

module.exports = app => {
  app.get('/api/users/id/:email', getUserIdFromEmail)

  app.get('/api/users/avatar/:email', getUserAvatarFromEmail)

  app.get('/api/users/user/:displayName', getUserFromDisplayName)
}