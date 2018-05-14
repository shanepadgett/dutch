const faker = require('faker')

const userModel = {'values': []}

function fillModel() {
  for (let i = 1; i < 4; i++) {
    userModel.values.push({
      'first_name': faker.name.firstName(),
      'last_name': faker.name.lastName(),
      'email': faker.internet.email(),
      'username': faker.internet.userName(),
      'avatar': faker.internet.avatar(),
      'id': i
    })
  }
}

fillModel()

module.exports = {
  'getUser': id => userModel.values.find(user => user.id === parseInt(id)),
  'getUsers': () => userModel.values,
  'createUser': user => {
    const nextId = userModel.values.length + 1
    userModel.values.push({
      ...user, id: nextId // the ... operator is the property spread operator
    })
    return Promise.resolve({'id': nextId})
  }
}