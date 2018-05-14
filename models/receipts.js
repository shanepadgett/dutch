module.exports = function(sequelize, DataTypes) {
  var Receipt = sequelize.define('Receipt', {
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
    'tax_total': {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true
      }
    },
    'tip_total': {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true
      }
    },
    'receipt_total': {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true
      }
    }
  })

  Receipt.associate = models => {
    Receipt.belongsTo(models.User, {
      as: 'owner',
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Receipt
}
