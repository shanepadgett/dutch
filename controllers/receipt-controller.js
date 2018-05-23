const db = require('../models')
const dbReceipt = db.Receipt
const dbUser = db.User

class Receipt {
  static getReceipt({params: { receiptId }}, res) {
    // dbReceipt.findOne({
    //   where: {
    //     id: receiptId
    //   },
    //   include: [
    //     {
    //       model: dbUser,
    //       as: 'owner'
    //     }
    //   ]
    // }).then(receipt => {
    //   res.json(receipt)
    // })    
  }

  static getReceipts(ownerId) {
    return dbReceipt.findAll({
      where: {
        ownerId: ownerId
      },
      include: {
        model: dbUser,
        as: 'owner'
      }
    }).then(receipts => receipts)
  }

  static createReceipt({body}, res) {
    dbReceipt.create({
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