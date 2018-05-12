const faker = require('faker')

const receiptModel = {'values': []}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillModel() {
  for (let i = 1; i < 11; i++) {
    receiptModel.values.push({
      'place': faker.company.companyName(),
      'user_id': getRandomIntInclusive(1, 3),
      'id': i
    })
  }
}

fillModel()

module.exports = {
  'getReceipt': id => receiptModel.values.find(receipt => receipt.id === id),
  'getReceipts': () => receiptModel.values,
  'postReceipt': receipt => {
    const nextId = receiptModel.values.length + 1
    receiptModel.values.push({
      ...receipt, id: nextId
    })
    return Promise.resolve({'id': nextId})
  }
}