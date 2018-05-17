'use strict'

const faker = require('faker')
const { getRandomIntInclusive } = require('../lib/utils')

function createReceiptRecords() {
  const records = []

  for (let i = 0; i < 10; i++) {
    const record = {
      place: faker.company.companyName(),
      subtotal: parseFloat(faker.finance.amount(3, 300, 2)),
      taxTotal: parseFloat(faker.finance.amount(3, 22, 2)),
      tipTotal: parseFloat(faker.finance.amount(3, 25, 2)),
      receiptTotal: parseFloat(faker.finance.amount(3, 375, 2)),
      ownerId: getRandomIntInclusive(1, 3),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    records.push(record)
  }

  return records
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('receipts', createReceiptRecords(), {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
}
