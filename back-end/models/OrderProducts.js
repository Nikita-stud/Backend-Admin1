module.exports = (sequelize, Sequelize) => {
  const OrderProducts = sequelize.define('OrderProduct', {
    quantity: {
      type: Sequelize.DataTypes.INTEGER,
      validate: { min: 1 },
      defaultValue: 1,
      allowNull: false,
    },
    unit_price: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  OrderProducts.associate = function (models) {
    OrderProducts.belongsTo(models.Order, {
      foreignKey: { name: 'order_id', allowNull: false },
    });
    OrderProducts.belongsTo(models.Product, {
      foreignKey: { name: 'product_id', allowNull: false },
    });
  };

  return OrderProducts;
};
