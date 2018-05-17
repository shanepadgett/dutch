module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    'firstName': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    'lastName': {
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
    'displayName': {
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
    User.hasMany(models.Receipt, {
      foreignKey: 'ownerId'
    })
    User.hasMany(models.Item, {
      foreignKey: 'assigneeId'
    })
  }

  return User
}
