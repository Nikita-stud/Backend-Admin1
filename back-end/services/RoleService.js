class RoleService {
  constructor(db) {
    this.client = db.sequelize;
    this.role = db.Role;
  }

  async populateRoles(toCheck) {
    return this.role.bulkCreate(
      [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
      ],
      { transaction: toCheck },
    );
  }
}
module.exports = RoleService;
