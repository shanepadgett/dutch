const {createItem} = require('../controllers/item-controller')

module.exports = app => {
  app.post('/api/items/', createItem)
}