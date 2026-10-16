const { QueryTypes } = require('sequelize');

class ProductService {
  constructor(db) {
    this.client = db.sequelize;
    this.product = db.Product;
    this.brand = db.Brand;
    this.category = db.Category;
  }
  async create(product, toCheck) {
    return this.product.create(product, { transaction: toCheck });
  }
  async count() {
    return this.product.count();
  }

  async getAll(role) {
    const isAdmin = role === 1;
    const deletedColumn = isAdmin ? 'p.isdeleted,' : '';
    const where = isAdmin ? '' : 'WHERE p.isdeleted = false';

    return await this.client.query(
      `SELECT p.name, p.id, p.description,
            p.unitprice,
            p.date_added, p.imgurl, p.quantity,
            ${deletedColumn}
            p.created_at AS createdAt,
            p.brand_id AS BrandId,
            p.category_id AS CategoryId,
            b.name AS brand,
            c.name AS category FROM products AS p
     JOIN brands AS b ON p.brand_id = b.id
     JOIN categories AS c ON p.category_id = c.id 
     ${where}
     ORDER BY p.id`,
      {
        type: QueryTypes.SELECT,
      },
    );
  }

  async getSingleProduct(id, role) {
    const isAdmin = role === 1;
    const deletedColumn = isAdmin ? 'p.isdeleted,' : '';
    const where = isAdmin ? '' : 'WHERE p.isdeleted = false';

    const rows = await this.client.query(
      `SELECT p.name, p.id, p.description,
            p.unitprice,
            p.date_added, p.imgurl, p.quantity,
            ${deletedColumn}
            p.created_at AS createdAt,
            p.brand_id AS BrandId,
            p.category_id AS CategoryId,
            b.name AS brand,
            c.name AS category FROM products AS p
     JOIN brands AS b ON p.brand_id = b.id
     JOIN categories AS c ON p.category_id = c.id AND p.id = :id
     ${where}`,
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      },
    );
    return rows[0];
  }

  async createNew(
    name,
    description,
    unitprice,
    quantity,
    imgurl,
    brand,
    category,
  ) {
    const createdBrand = await this.brand.findOrCreate({
      where: { name: brand },
    });
    const createdCategory = await this.category.findOrCreate({
      where: { name: category },
    });
    return this.product.create({
      name,
      description,
      unitprice,
      quantity,
      imgurl,
      date_added: new Date(),
      brand_id: createdBrand[0].id,
      category_id: createdCategory[0].id,
    });
  }

  async update(
    id,
    name,
    description,
    unitprice,
    quantity,
    imgurl,
    brand,
    category,
    isdeleted,
  ) {
    const product = await this.product.findByPk(id);

    if (!product) {
      return null;
    }

    const createdBrand = await this.brand.findOrCreate({
      where: { name: brand },
    });
    const createdCategory = await this.category.findOrCreate({
      where: { name: category },
    });
    return product.update(
      {
        name,
        description,
        unitprice,
        quantity,
        imgurl,
        brand_id: createdBrand[0].id,
        category_id: createdCategory[0].id,
        isdeleted: isdeleted ?? product.isdeleted,
      },
      { where: { id: id } },
    );
  }

  async delete(id) {
    const product = await this.product.findOne({
      where: { id: id, isdeleted: false },
    });
    if (!product) {
      return null;
    }

    product.isdeleted = true;
    return await product.save();
  }

  async search(role, name, category, brand) {
    const isAdmin = role === 1;
    const deletedColumn = isAdmin ? 'p.isdeleted,' : '';
    const deleted = isAdmin ? '' : 'AND p.isdeleted = false';

    return await this.client.query(
      `SELECT p.name, p.id, p.description,
            p.unitprice,
            p.date_added, p.imgurl, p.quantity,
            ${deletedColumn}
            p.created_at AS createdAt,
            p.brand_id AS BrandId,
            p.category_id AS CategoryId,
            b.name AS brand,
            c.name AS category FROM products AS p
     JOIN brands AS b ON p.brand_id = b.id
     JOIN categories AS c ON p.category_id = c.id
     WHERE p.name LIKE :name
     AND c.name LIKE :category
     AND b.name LIKE :brand
     ${deleted}
     ORDER BY p.id`,
      {
        replacements: {
          name: `%${name || ''}%`,
          category: category || '%',
          brand: brand || '%',
        },
        type: QueryTypes.SELECT,
      },
    );
  }

  async reduce(productId, quantity, toCheck) {
    return this.product.decrement('quantity', {
      by: quantity,
      where: { id: productId },
      transaction: toCheck,
    });
  }
}
module.exports = ProductService;
