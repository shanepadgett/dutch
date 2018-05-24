const {createItem, updateItem} = require('../controllers/item-controller')

module.exports = app => {
  app.post('/api/items/', createItem)
  app.put('/api/items/:id', updateItem)
}