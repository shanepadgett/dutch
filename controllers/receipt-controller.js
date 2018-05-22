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

  static createReceipt({ body }, res) {
    // return model.createReceipt(body).then(({ id }) =>
    //   res.set('Location', `/api/receipts/${id}`).send(204)
    // )
  }
}

module.exports = Receipt