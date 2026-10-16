class BrandService {
  constructor(db) {
    this.client = db.sequelize;
    this.brand = db.Brand;
  }

  async createIfDoesNotExist(brand, toCheck) {
    const createdBrand = await this.brand.findOrCreate({
      where: { name: brand },
      transaction: toCheck,
    });
    return createdBrand[0];
  }
  async getAll() {
    return this.brand.findAll();
  }
  async getSingleBrand(id) {
    return this.brand.findByPk(id);
  }
  async findByName(name) {
    return this.brand.findOne({ where: { name } });
  }
  async create(name) {
    return this.brand.create({ name });
  }
  async update(id, name) {
    const existing = await this.brand.findByPk(id);
    if (!existing) {
      return null;
    }
    existing.name = name;
    await existing.save();
    return existing;
  }
  async delete(id) {
    return this.brand.destroy({ where: { id } });
  }
}
module.exports = BrandService;
