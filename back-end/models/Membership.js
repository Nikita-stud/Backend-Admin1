module.exports = (sequelize, Sequelize) => {
  const Membership = sequelize.define('Membership', {
    name: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    discount: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    minItems: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    maxItems: {
      type: Sequelize.DataTypes.INTEGER,
    },
  });

  Membership.associate = function (models) {
    Membership.hasMany(models.User, {
      foreignKey: { name: 'membership_id', allowNull: false, defaultValue: 1 },
      onDelete: 'RESTRICT',
    });
    Membership.hasMany(models.Order, {
      foreignKey: { name: 'membership_id', allowNull: false },
      onDelete: 'RESTRICT',
    });
  };

  return Membership;
};
