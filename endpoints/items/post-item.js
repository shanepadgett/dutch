const {postItem} = require('../../models/mock/item-mock')

module.exports = ({body}, res) => postItem(body)
  .then(({id}) => res.set('Location', `/api/items/${id}`).send(204))