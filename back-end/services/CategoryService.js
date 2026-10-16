class CategoryService {
  constructor(db) {
    this.client = db.sequelize;
    this.category = db.Category;
  }
  async createIfDoesNotExist(category, toCheck) {
    const createdCategory = await this.category.findOrCreate({
      where: { name: category },
      transaction: toCheck,
    });
    return createdCategory[0];
  }
  async getAll() {
    return this.category.findAll();
  }
  async getSingleCategory(id) {
    return this.category.findByPk(id);
  }
  async findByName(name) {
    return this.category.findOne({ where: { name } });
  }
  async create(name) {
    return this.category.create({ name });
  }
  async update(id, name) {
    const existing = await this.category.findByPk(id);
    if (!existing) {
      return null;
    }
    existing.name = name;
    await existing.save();
    return existing;
  }
  async delete(id) {
    return this.category.destroy({ where: { id } });
  }
}
module.exports = CategoryService;
