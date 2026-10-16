module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('Product', {
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    unitprice: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    imgurl: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    date_added: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    isdeleted: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Product.associate = function (models) {
    Product.belongsTo(models.Brand, {
      foreignKey: { name: 'brand_id', allowNull: false },
    });
    Product.belongsTo(models.Category, {
      foreignKey: { name: 'category_id', allowNull: false },
    });
    Product.hasMany(models.Cart, {
      foreignKey: { name: 'product_id', allowNull: false },
      onDelete: 'RESTRICT',
    });
    Product.hasMany(models.OrderProduct, {
      foreignKey: { name: 'product_id', allowNull: false },
      onDelete: 'RESTRICT',
    });
  };

  return Product;
};
