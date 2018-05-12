const {getUsers} = require('../../models/mock/user-mock')

module.exports = (_, res) => res.json(getUsers())