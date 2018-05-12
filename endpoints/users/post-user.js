const {postUser} = require('../../models/mock/user-mock')

module.exports = ({body}, res) => postUser(body)
  .then(({id}) => res.set('Location', `/api/users/${id}`).send(204))