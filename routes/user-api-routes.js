const {getUserIdFromEmail} = require('../controllers/user-controller')

module.exports = app => {
  app.get('/api/users/id/:email', getUserIdFromEmail)
}