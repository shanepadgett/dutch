const db = require('../models')
const dbItem = db.Item
const dbUser = db.User
const dbReceipt = db.Receipt

class Item {
  static getItem(
    {
      params: { itemId }
    },
    res
  ) {
    dbItem
      .findOne({
        where: {
          id: itemId
        },
        include: [
          {
            model: dbUser,
            as: 'assignee'
          }
        ]
      })
      .then(item => {
        res.json(item)
      })
  }

  static getItems(
    {
      params: { assigneeId }
    },
    res
  ) {
    let query = {}

    if (assigneeId) {
      query.assigneeId = assigneeId
    }

    dbItem
      .findAll({
        where: query,
        include: [
          {model: dbUser, as: 'assignee'},
          {model: dbReceipt, as: 'receipt', include: [{model: dbUser, as: 'owner'}]}
        ]
      })
      .then(items => {
        res.json(items)
      })
  }

  static createItem({ body }, res) {
    // return model.createItem(body).then(({ id }) =>
    //   res.set('Location', `/api/items/${id}`).send(204)
    // )
  }
}

module.exports = Item

// const model = require('../models/mock/item-mock')

// class Item {
//   static getItem(
//     {
//       params: { itemId }
//     },
//     res
//   ) {
//     res.json(model.getItem(itemId))
//   }

//   static getItems(_, res) {
//     res.json(model.getItems())
//   }

//   static createItem({ body }, res) {
//     return model.createItem(body).then(({ id }) =>
//       res.set('Location', `/api/items/${id}`).send(204)
//     )
//   }
// }

// module.exports = Item
