const {getItem} = require('../../models/mock/item-mock')

module.exports = ({params: {itemId}}, res) => res.json(getItem(parseInt(itemId)))