const crypto = require('crypto');
const { promisify } = require('util');
const { Op } = require('sequelize');
const pbkdf2 = promisify(crypto.pbkdf2);

class UserService {
  constructor(db) {
    this.client = db.sequelize;
    this.user = db.User;
    this.membership = db.Membership;
  }

  async createAdmin(toCheck) {
    const salt = crypto.randomBytes(16);
    const hashedPassword = await pbkdf2(
      'P@ssword2023',
      salt,
      310000,
      32,
      'sha256',
    );

    return this.user.create(
      {
        username: 'Admin',
        password: hashedPassword,
        salt,
        email: 'admin@noroff.no',
        firstName: 'Admin',
        lastName: 'Support',
        address: 'Online',
        phone: '911',
        role_id: 1,
        membership_id: 1,
      },
      { transaction: toCheck },
    );
  }
  async register(
    firstName,
    lastName,
    username,
    email,
    address,
    city,
    phone,
    password,
    salt,
  ) {
    return this.user.create({
      username,
      password,
      email,
      firstName,
      lastName,
      address,
      city,
      phone,
      salt,
      role_id: 2,
      membership_id: 1,
    });
  }

  async getAll() {
    return await this.user.findAll({
      attributes: { exclude: ['password', 'salt'] },
    });
  }

  async getOne(loginName) {
    return await this.user.findOne({
      where: {
        [Op.or]: [{ email: loginName }, { username: loginName }],
      },
    });
  }

  async getOnesMembership(id) {
    return await this.user.findByPk(id, {
      attributes: ['membership_id'],
      include: [{ model: this.membership }],
    });
  }

  async update(id, role_id) {
    const user = await this.user.findByPk(id, {
      attributes: { exclude: ['password', 'salt'] },
    });
    if (!user) {
      return null;
    }

    user.role_id = role_id;
    await user.save();
    return user;
  }

  async delete(id) {
    return this.user.destroy({ where: { id } });
  }
  async updateMembership(id, membership_id) {
    return this.user.update({ membership_id }, { where: { id } });
  }
}
module.exports = UserService;
