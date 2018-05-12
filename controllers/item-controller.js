const model = require('../models/mock/item-mock')

class Item {
  static getItem(
    {
      params: { itemId }
    },
    res
  ) {
    res.json(model.getItem(itemId))
  }

  static getItems(_, res) {
    res.json(model.getItems())
  }

  static createItem({ body }, res) {
    return model.createItem(body).then(({ id }) =>
      res.set('Location', `/api/items/${id}`).send(204)
    )
  }
}

module.exports = Item
