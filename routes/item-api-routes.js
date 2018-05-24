const {createItem, updateItem} = require('../controllers/item-controller')

module.exports = app => {
  app.post('/api/items/', createItem)
  app.post('/api/items/:id', updateItem)
}