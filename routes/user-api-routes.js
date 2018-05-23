const {getUserIdFromEmail, getUserAvatarFromEmail} = require('../controllers/user-controller')

module.exports = app => {
  app.get('/api/users/id/:email', getUserIdFromEmail)

  app.get('/api/users/avatar/:email', getUserAvatarFromEmail)
}