class OrderProductService {
  constructor(db) {
    this.client = db.sequelize;
    this.orderProduct = db.OrderProduct;
    this.order = db.Order;
  }

  async create(order, toCheck) {
    return this.orderProduct.create(order, { transaction: toCheck });
  }
  async totalBoughtByUser(user_id) {
    return this.orderProduct.sum('quantity', {
      include: [{ model: this.order, where: { user_id }, attributes: [] }],
    });
  }
}
module.exports = OrderProductService;
