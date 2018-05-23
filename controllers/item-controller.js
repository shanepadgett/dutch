const db = require('../models')
const dbItem = db.Item
const dbReceipt = db.Receipt
const dbUser = db.User
const { getUserIdFromAuthId } = require('../controllers/user-controller')

class Item {

  static getItemsByAssignee(userAuthId) {
    return getUserIdFromAuthId(userAuthId).then(userId => {
      return dbItem
        .findAll({
          where: {
            assigneeId: userId
          },
          include: [
            { model: dbUser, as: 'assignee' },
            {
              model: dbReceipt,
              as: 'receipt',
              include: [{ model: dbUser, as: 'owner' }]
            }
          ]
        })
        .then(items => items)
    })
  }

  // static createItem({ body }, res) {
  //   return model.createItem(body).then(({ id }) =>
  //     res.set('Location', `/api/items/${id}`).send(204)
  //   )
  // }
}

module.exports = Item
