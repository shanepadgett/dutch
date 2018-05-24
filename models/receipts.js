module.exports = function(sequelize, DataTypes) {
  var Receipt = sequelize.define('Receipt', {
    'receiptDate': {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    'place': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    'subtotal': {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true
      }
    },
    'taxTotal': {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true
      }
    },
    'tipTotal': {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true
      }
    },
    'receiptTotal': {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true
      }
    }
  })

  Receipt.associate = models => {
    Receipt.hasMany(models.Item, {
      foreignKey: 'receiptId'/*,
      as: 'receipt'*/
    })
    Receipt.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner'
    })
  }

  return Receipt
}
