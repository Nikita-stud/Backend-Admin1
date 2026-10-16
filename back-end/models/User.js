module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    firstName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: {
      type: Sequelize.DataTypes.BLOB,
      allowNull: false,
    },
    address: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: Sequelize.DataTypes.BLOB,
      allowNull: false,
    },
  });
  User.associate = function (models) {
    User.belongsTo(models.Role, {
      foreignKey: { name: 'role_id', allowNull: false, defaultValue: 2 },
    });
    User.belongsTo(models.Membership, {
      foreignKey: { name: 'membership_id', allowNull: false, defaultValue: 1 },
    });
    User.hasMany(models.Order, {
      foreignKey: { name: 'user_id', allowNull: false },
      onDelete: 'RESTRICT',
    });
    User.hasMany(models.Cart, {
      foreignKey: { name: 'user_id', allowNull: false },
      onDelete: 'CASCADE',
    });
  };
  return User;
};
