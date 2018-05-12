const {getUser, getUsers, createUser} = require('../controllers/user-controller')

module.exports = app => {
  app.get('/api/users/:userId', getUser)
  app.get('/api/users/', getUsers)
  app.post('/api/users/', createUser)
}