const db = require('../models')
const dbUser = db.User

class User {
  static getUserIdFromAuthId(userAuthId) {
    return dbUser.findOne({
      where: {
        authId: userAuthId
      }
    }).then(user => user.id)
  }

  static getUserIdFromEmail({params: {email}}, res) {
    return dbUser.findOne({
      where: {
        email: email
      }
    }).then(user => res.json(user.id))
  }

  static getUserAvatarFromEmail({params: {email}}, res) {
    return dbUser.findOne({
      where: {
        email: email
      }
    }).then(user => res.json(user.avatar))
  }

  // static getUser(
  //   {
  //     params: { userId }
  //   },
  //   res
  // ) {
  //   dbUser.findOne({
  //     where: {
  //       id: userId
  //     }
  //   }).then(user => {
  //     res.json(user)
  //   })
  // }

  // static getUsers(_, res) {
  //   dbUser.findAll({}).then(users => {
  //     res.json(users)
  //   })
  // }

  // static createUser({ body }, res) {
  //   return model.createUser(body).then(({ id }) =>
  //     res.set('Location', `/api/users/${id}`).send(204)
  //   )
  // }
}

module.exports = User