const model = require('../models/mock/receipt-mock')

class Receipt {
  static getReceipt(
    {
      params: { receiptId }
    },
    res
  ) {
    res.json(model.getReceipt(receiptId))
  }

  static getReceipts(_, res) {
    res.json(model.getReceipts())
  }

  static createReceipt({ body }, res) {
    return model.createReceipt(body).then(({ id }) =>
      res.set('Location', `/api/receipts/${id}`).send(204)
    )
  }
}

module.exports = Receipt