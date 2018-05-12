const faker = require('faker')

const userModel = {'values': []}

function fillModel() {
  for (let i = 1; i < 4; i++) {
    userModel.values.push({
      'name': `${faker.name.lastName()}, ${faker.name.firstName()}`,
      'email': faker.internet.email(),
      'username': faker.internet.userName(),
      'avatar': faker.internet.avatar(),
      'id': i
    })
  }
}

fillModel()

module.exports = {
  'getUser': id => userModel.values.find(user => user.id === id),
  'getUsers': () => userModel.values,
  'postUser': user => {
    const nextId = userModel.values.length + 1
    userModel.values.push({
      ...user, id: nextId // the ... operator is the property spread operator
    })
    return Promise.resolve({'id': nextId})
  }
}