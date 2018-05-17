module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    'name': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    'quantity': {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    'price': {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true
      }
    }
  })

  Item.associate = models => {
    Item.belongsTo(models.Receipt, {
      foreignKey: 'receiptId'
    })
    Item.belongsTo(models.User, {
      foreignKey: 'assigneeId'
    })
  }

  return Item
}
