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

  static getUserEmailFromAuthId({user}, res) {
    return dbUser.findOne({
      where: {
        authId: user.id
      }
    }).then(user => res.json(user.email))
  }
  
  static getUserAvatarFromEmail({params: {email}}, res) {
    return dbUser.findOne({
      where: {
        email: email
      }
    }).then(user => res.json(user.avatar))
  }
}

module.exports = User