const {getUser, getUsers, createUser} = require('../controllers/user-controller')
const {getReceipts} = require('../controllers/receipt-controller')

module.exports = app => {
  app.get('/api/users/:userId', getUser)
  app.get('/api/users/', getUsers)
  app.get('/api/users/receipts/:ownerId', getReceipts)
  app.post('/api/users/', createUser)
}