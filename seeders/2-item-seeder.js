'use strict'

const faker = require('faker')
const { getRandomIntInclusive } = require('../lib/utils')

function createItemRecords() {
  const records = []

  for (let i = 0; i < 10; i++) {
    const record = {
      name: faker.commerce.productName(),
      quantity: getRandomIntInclusive(1, 3),
      price: parseFloat(faker.finance.amount(3, 35, 2)),
      isPaid: getRandomIntInclusive(0, 1),
      receiptId: getRandomIntInclusive(1, 10),
      assigneeId: getRandomIntInclusive(1, 3),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    records.push(record)
  }

  return records
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('items', createItemRecords(), {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
