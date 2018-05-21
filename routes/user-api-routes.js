const {getUser, getUsers, createUser} = require('../controllers/user-controller')
const {getReceipts} = require('../controllers/receipt-controller')
const {getItems} = require('../controllers/item-controller')

module.exports = app => {
  app.get('/api/users/:userId', getUser)
  app.get('/api/users/', getUsers)
  app.get('/api/users/receipts/:ownerId', getReceipts)
  app.get('/api/users/receipts/items/:assigneeId', getItems)
  app.post('/api/users/', createUser)
}