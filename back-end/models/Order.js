module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('Order', {
    order_number: {
      type: Sequelize.DataTypes.STRING(8),
      allowNull: false,
      unique: true,
    },
    status: {
      type: Sequelize.DataTypes.ENUM('In Progress', 'Ordered', 'Completed'),
      allowNull: false,
      defaultValue: 'In Progress',
    },
    discount: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  Order.associate = function (models) {
    Order.belongsTo(models.User, {
      foreignKey: { name: 'user_id', allowNull: false },
    });
    Order.belongsTo(models.Membership, {
      foreignKey: { name: 'membership_id', allowNull: false },
    });
    Order.hasMany(models.OrderProduct, {
      foreignKey: { name: 'order_id', allowNull: false },
      onDelete: 'CASCADE',
    });
  };

  return Order;
};
