const {getUser} = require('../../models/mock/user-mock')

module.exports = ({params: {userId}}, res) => res.json(getUser(parseInt(userId)))