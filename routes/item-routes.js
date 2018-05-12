const {getItem, getItems, postItem} = require('../controllers/item-controller')

module.exports = app => {
  app.get('/api/items/:userId', getItem)
  app.get('/api/items/', getItems)
  app.post('/api/items/', postItem)
}