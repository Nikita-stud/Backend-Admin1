class CartService {
  constructor(db) {
    this.client = db.sequelize;
    this.cart = db.Cart;
    this.product = db.Product;
  }

  async getAll(user_id) {
    const cartNow = await this.cart.findAll({
      where: { user_id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: this.product,
          attributes: ['name', 'imgurl', 'unitprice', 'quantity'],
        },
      ],
    });

    return cartNow.map((inCart) => ({
      id: inCart.id,
      quantity: inCart.quantity,
      product_id: inCart.product_id,
      name: inCart.Product.name,
      unitprice: inCart.Product.unitprice,
      imgurl: inCart.Product.imgurl,
      total_price: inCart.quantity * inCart.Product.unitprice,
    }));
  }

  async ifInCart(user_id, product_id) {
    return this.cart.findOne({
      where: { user_id, product_id },
    });
  }

  async addOrGetRid(user_id, product_id, quantity) {
    const existing = await this.ifInCart(user_id, product_id);

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return existing;
    }

    return this.cart.create({ user_id, product_id, quantity });
  }
  async clear(user_id, toCheck) {
    return this.cart.destroy({ where: { user_id }, transaction: toCheck });
  }
}
module.exports = CartService;
