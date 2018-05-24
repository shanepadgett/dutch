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
            /*{ model: dbUser, as: 'assignee' },*/
            {
              model: dbReceipt,
              include: [{ model: dbUser, as: 'owner' }]
            }
          ]
        })
        .then(items => items)
    })
  }

  static createItem({ body }, res) {
    dbItem
      .create({
        name: body.name,
        quantity: body.quantity,
        price: body.price,
        isPaid: body.isPaid,
        receiptId: body.receiptId,
        assigneeId: body.assigneeId
      })
      .then(data => res.json(data.id))
      .catch(err => res.json(err))
  }

  static updateItem(req, res) {
    dbItem
      .update(
        {
          isPaid: req.body.isPaid
        },
        {
          where: {
            id: req.params.id
          }
        }
      )
      .then(data => res.json(data))
      .catch(err => res.json(err))
  }
}

module.exports = Item
