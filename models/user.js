module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    'first_name': DataTypes.STRING,
    'last_name': DataTypes.STRING
  })

  User.associate = function(models) {
    // Associating User with Items and Receipts
    User.hasMany(models.Item)
  }

  return User
}
