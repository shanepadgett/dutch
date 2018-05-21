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
    },
    'isPaid': {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  })

  Item.associate = models => {
    Item.belongsTo(models.Receipt, {
      foreignKey: 'receiptId',
      as: 'receipt'
    })
    Item.belongsTo(models.User, {
      foreignKey: 'assigneeId',
      as: 'assignee'
    })
  }

  return Item
}
