const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Testing routes', () => {
  let token;
  let categoryId;
  let brandId;
  let productId;

  async function deleteAll() {
    await db.Product.destroy({ where: { name: 'TEST_PRODUCT' }, force: true });
    await db.Category.destroy({
      where: { name: ['TEST_CATEGORY', 'TEST_CATEGORY2'] },
    });
    await db.Brand.destroy({ where: { name: ['TEST_BRAND', 'TEST_BRAND2'] } });
  }

  beforeAll(async () => {
    await deleteAll();

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@noroff.no', password: 'P@ssword2023' });

    token = response.body.data.token;
  });

  it('POST /categories', async () => {
    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'TEST_CATEGORY' });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('created');
    categoryId = response.body.data.created.id;
  });

  it('POST /brands', async () => {
    const response = await request(app)
      .post('/brands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'TEST_BRAND' });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('created');
    brandId = response.body.data.created.id;
  });

  it('POST /products', async () => {
    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TEST_PRODUCT',
        description: 'test',
        unitprice: 99.99,
        quantity: 10,
        imgurl: 'hhtps://test.jpg',
        brand: 'TEST_BRAND',
        category: 'TEST_CATEGORY',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('products');
    productId = response.body.data.products.id;
  });

  it('GET initial product /products/:id', async () => {
    const response = await request(app)
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.products.brand).toBe('TEST_BRAND');
    expect(response.body.data.products.category).toBe('TEST_CATEGORY');
  });

  it('PUT /categories/:id', async () => {
    const response = await request(app)
      .put(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'TEST_CATEGORY2' });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.update.name).toBe('TEST_CATEGORY2');
  });

  it('PUT /brands/:id', async () => {
    const response = await request(app)
      .put(`/brands/${brandId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'TEST_BRAND2' });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.update.name).toBe('TEST_BRAND2');
  });

  it('GET updated product /products/:id', async () => {
    const response = await request(app)
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.products.brand).toBe('TEST_BRAND2');
    expect(response.body.data.products.category).toBe('TEST_CATEGORY2');
  });

  it('DELETE /products/:id', async () => {
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.result).toBe(
      `Product with id ${productId} has been deleted`,
    );
  });

  afterAll(async () => {
    await deleteAll();
    await db.sequelize.close();
  });
});
