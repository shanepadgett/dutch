module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    'first_name': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    'last_name': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    'email': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
        isEmail: true
      }
    },
    'display_name': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    'avatar': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  })

  User.associate = models => {
  }

  return User
}
