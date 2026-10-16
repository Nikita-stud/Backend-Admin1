module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define('Brand', {
    name: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  Brand.associate = function (models) {
    Brand.hasMany(models.Product, {
      foreignKey: { name: 'brand_id', allowNull: false },
      onDelete: 'RESTRICT',
    });
  };

  return Brand;
};
