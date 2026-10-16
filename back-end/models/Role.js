module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('Role', {
    name: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  Role.associate = function (models) {
    Role.hasMany(models.User, {
      foreignKey: { name: 'role_id', allowNull: false, defaultValue: 2 },
      onDelete: 'RESTRICT',
    });
  };

  return Role;
};
