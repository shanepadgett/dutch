const db = require('../models')
const dbReceipt = db.Receipt
const dbUser = db.User
const dbItem = db.Item

class Receipt {
  static getReceipts(ownerId) {
    return dbReceipt
      .findAll({
        where: {
          ownerId: ownerId
        },
        include: [
          {
            model: dbUser,
            as: 'owner'
          },
          {
            model: dbItem
          }
        ]
      })
      .then(receipts => receipts)
  }

  static createReceipt({ body }, res) {
    dbReceipt
      .create({
        place: body.place,
        subtotal: body.subtotal,
        taxTotal: body.taxTotal,
        tipTotal: body.tipTotal,
        receiptTotal: body.receiptTotal,
        ownerId: body.ownerId
      })
      .then(data => res.json(data.id))
      .catch(err => res.json(err))
  }
}

module.exports = Receipt
