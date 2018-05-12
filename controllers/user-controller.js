const model = require('../models/mock/user-mock')

class User {
  static getUser(
    {
      params: { userId }
    },
    res
  ) {
    res.json(model.getUser(userId))
  }

  static getUsers(_, res) {
    res.json(model.getUsers())
  }

  static createUser({ body }, res) {
    return model.createUser(body).then(({ id }) =>
      res.set('Location', `/api/users/${id}`).send(204)
    )
  }
}

module.exports = User