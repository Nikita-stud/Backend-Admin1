class OrderService {
  constructor(db) {
    this.client = db.sequelize;
    this.order = db.Order;
    this.orderProduct = db.OrderProduct;
    this.product = db.Product;
  }

  async getAll(user_id, role) {
    const where = role === 1 ? {} : { user_id };

    const orders = await this.order.findAll({
      where,
      include: [
        {
          model: this.orderProduct,
          attributes: ['quantity', 'unit_price'],
          include: [
            { model: this.product, attributes: ['id', 'name', 'imgurl'] },
          ],
        },
      ],
    });

    return orders.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      discount: order.discount,
      total: order.total,
      createdAt: order.createdAt,
      user_id: order.user_id,
      membership_id: order.membership_id,
      products: order.OrderProducts.map((each) => ({
        product_id: each.Product.id,
        name: each.Product.name,
        imgurl: each.Product.imgurl,
        quantity: each.quantity,
        unit_price: each.unit_price,
        total_price: each.quantity * each.unit_price,
      })),
    }));
  }

  async getSingleOrder(id, user_id, role) {
    const where = role === 1 ? { id } : { id, user_id };

    const order = await this.order.findOne({
      where,
      include: [
        {
          model: this.orderProduct,
          attributes: ['quantity', 'unit_price'],
          include: [
            {
              model: this.product,
              attributes: ['id', 'name', 'imgurl'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return null;
    }

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      discount: order.discount,
      total: order.total,
      createdAt: order.createdAt,
      user_id: order.user_id,
      membership_id: order.membership_id,
      products: order.OrderProducts.map((line) => ({
        product_id: line.Product.id,
        name: line.Product.name,
        imgurl: line.Product.imgurl,
        quantity: line.quantity,
        unit_price: line.unit_price,
        total_price: line.quantity * line.unit_price,
      })),
    };
  }

  async updateStatus(id, status) {
    const order = await this.order.findByPk(id);
    if (!order) {
      return null;
    }

    order.status = status;
    await order.save();
    return order;
  }

  async create(order, toCheck) {
    return this.order.create(order, { transaction: toCheck });
  }
}
module.exports = OrderService;
