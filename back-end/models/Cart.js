module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define(
    'Cart',
    {
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        validate: { min: 1 },
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      indexes: [{ unique: true, fields: ['user_id', 'product_id'] }],
    },
  );

  Cart.associate = function (models) {
    Cart.belongsTo(models.User, {
      foreignKey: { name: 'user_id', allowNull: false },
    });
    Cart.belongsTo(models.Product, {
      foreignKey: { name: 'product_id', allowNull: false },
    });
  };

  return Cart;
};
