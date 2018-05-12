const {getItems} = require('../../models/mock/item-mock')

module.exports = (_, res) => res.json(getItems())