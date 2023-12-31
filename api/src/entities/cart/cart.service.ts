import { ModelStatic } from "sequelize";
import Product from "../../database/models/Product";
import { resp } from "../../utils/resp";
import Cart from "../../database/models/Cart";
import User from "../../database/models/User";
class CartService {
  private model: ModelStatic<Product> = Product;

  async get(userId: number) {
    const findUser = await User.findByPk(userId);
    if (!findUser) return resp(404, "User not found");

    const cartProducts = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    return resp(200, cartProducts || []);
  }

  async cart(productId: number, userId: number) {
    const findProduct = await this.model.findByPk(productId);
    if (!findProduct) return resp(404, "Product not found");

    const cart = await Cart.findOne({
      where: { productId, userId },
    });

    if (cart) {
      await cart.update({ quantity: cart.quantity + 1 });
      return resp(200, "Updated");
    }

    await Cart.create({ productId, userId, quantity: 1 });
    return resp(201, "Created");
  }

  async update(productId: number, userId: number, quantity: number) {
    const findProduct = await this.model.findByPk(productId);
    if (!findProduct) return resp(404, "Product not found");

    const cart = await Cart.findOne({
      where: { productId, userId },
    });
    if (!cart) return resp(404, "Product not found in cart");

    if (quantity < 1) return resp(400, "Quantity must be greater than 0");

    await cart.update({ quantity });
    return resp(200, "Updated");
  }

  async delete(productId: number, userId: number) {
    const findProduct = await this.model.findByPk(productId);
    if (!findProduct) return resp(404, "Product not found");

    const cart = await Cart.findOne({
      where: { productId },
    });
    if (!cart) return resp(404, "Product not found in cart");

    await cart.destroy();
    return resp(204, "Deleted");
  }
}

export default CartService;
