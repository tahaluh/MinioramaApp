import Order from "../database/models/Order";
import { ModelStatic } from "sequelize";
import ProductOrder from "../database/models/ProductOrder";
import Product from "../database/models/Product";
import { resp, respM } from "../utils/resp";
import Cart from "../database/models/Cart";
import User from "../database/models/User";

ProductOrder.associations;

class OrderService {
  private model: ModelStatic<Order> = Order;

  async get(userIdTk: number, role: string, userId?: number) {
    if (userId !== userIdTk && role !== "ADMIN")
      return respM(401, "Unauthorized");

    const orders = await this.model.findAll({
      where: userId ? { userId } : {},
      include: [{ model: Product, as: "products" }],
    });

    return resp(200, orders);
  }

  async create(userId: number) {
    const findUser = (await User.findByPk(userId, {
      include: [{ model: Product, as: "cartProducts" }],
    })) as User & { cartProducts: (Product & { Cart: Cart })[] };

    if (!findUser) return respM(404, "User not found");

    if (findUser.cartProducts.length === 0) return respM(400, "Cart is empty");

    const totalPrice = findUser.cartProducts.reduce(
      (acc, product) => acc + product.price * product.Cart.quantity,
      0
    );

    const createdOrder = await this.model.create({
      userId,
      total: totalPrice,
    });

    const productOrder = findUser.cartProducts.map((product) => ({
      productId: product.id,
      orderId: createdOrder.id,
      quantity: product.Cart.quantity,
      price: product.price,
    }));

    await ProductOrder.bulkCreate(productOrder);

    await Cart.destroy({ where: { userId } });

    return resp(201, createdOrder);
  }
}

export default OrderService;
