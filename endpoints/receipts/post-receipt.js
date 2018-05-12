const {postReceipt} = require('../../models/mock/receipt-mock')

module.exports = ({body}, res) => postReceipt(body)
  .then(({id}) => res.set('Location', `/api/receipts/${id}`).send(204))