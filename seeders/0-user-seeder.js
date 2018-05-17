'use strict'

const faker = require('faker')

function createUserRecords() {
  const records = []

  for (let i = 0; i < 10; i++) {
    const record = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      displayName: faker.internet.userName(),
      avatar: faker.internet.avatar(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    records.push(record)
  }

  return records
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', createUserRecords(), {})
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
