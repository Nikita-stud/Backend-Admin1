class MembershipService {
  constructor(db) {
    this.client = db.sequelize;
    this.membership = db.Membership;
  }

  async populateMemberships(toCheck) {
    return this.membership.bulkCreate(
      [
        { id: 1, name: 'Bronze', discount: 0, minItems: 0, maxItems: 15 },
        {
          id: 2,
          name: 'Silver',
          discount: 15,
          minItems: 15,
          maxItems: 30,
        },
        {
          id: 3,
          name: 'Gold',
          discount: 30,
          minItems: 30,
          maxItems: null,
        },
      ],
      { transaction: toCheck },
    );
  }
  async getAll() {
    return this.membership.findAll();
  }
  async getSingleMembership(id) {
    return this.membership.findByPk(id);
  }
  async update(id, discount) {
    const existing = await this.membership.findByPk(id);
    if (!existing) {
      return null;
    }
    await existing.update({ discount });
    return existing;
  }

  async calculateBought(total) {
    const id = total >= 30 ? 3 : total >= 15 ? 2 : 1;
    return this.membership.findByPk(id);
  }
}
module.exports = MembershipService;
