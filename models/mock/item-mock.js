const faker = require('faker')
const {getRandomIntInclusive} = require('../../lib/utils')

const itemModel = {'values': []}

function fillModel() {
  for (let i = 1; i < 4; i++) {
    const numItems = getRandomIntInclusive(1, 5)
    for (let j = 0; j < numItems; j++) {
      const price = parseFloat(faker.finance.amount(3, 55, 2))
      itemModel.values.push({
        'name': faker.commerce.productName(),
        'quantity': faker.random.number(4),
        'price': price,
        'tax': parseFloat((price * 0.08).toFixed(2)),
        'tip': parseFloat((price * 0.15).toFixed(2)),
        'receipt_id': i,
        'user_id': getRandomIntInclusive(1, 3),
        'id': itemModel.values.length + 1
      })
    }
  }
}

fillModel()

module.exports = {
  'getItem': id => itemModel.values.find(item => item.id === id),
  'getItems': () => itemModel.values,
  'postItem': item => {
    const nextId = itemModel.values.length + 1
    itemModel.values.push({
      ...item, id: nextId // the ... operator is the property spread operator
    })
    return Promise.resolve({'id': nextId})
  }
}