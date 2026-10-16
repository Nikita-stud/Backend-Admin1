module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  Category.associate = function (models) {
    Category.hasMany(models.Product, {
      foreignKey: { name: 'category_id', allowNull: false },
      onDelete: 'RESTRICT',
    });
  };
  return Category;
};
