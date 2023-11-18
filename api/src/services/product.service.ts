import { ModelStatic } from "sequelize";
import Product from "../database/models/Product";
import Category from "../database/models/Category";
import { resp, respM } from "../utils/resp";
import IProduct from "../interfaces/IProduct";
import ProductCategory from "../database/models/ProductCategory";
import schema from "./validations/schema";
import Wishlist from "../database/models/Wishlist";
import Cart from "../database/models/Cart";
import User from "../database/models/User";
import Order from "../database/models/Order";

ProductCategory.associations;

class ProductService {
  private model: ModelStatic<Product> = Product;

  async get() {
    const products = await this.model.findAll({
      include: [
        {
          model: Category,
          as: "categories",
        },
      ],
    });

    return resp(200, products);
  }

  async create(product: IProduct) {
    const { error } = schema.createProduct.validate(product);
    if (error) return resp(400, error.message);

    const categories = await Promise.all(
      product.categories!.map(async (id) => {
        return await Category.findByPk(id);
      })
    );

    if (categories.some((e) => !e)) return resp(400, "Category not found");

    const createdProduct = await this.model.create({
      ...product,
    });

    const productCategory = product.categories!.map((id) => ({
      productId: createdProduct.id,
      categoryId: id,
    }));

    await ProductCategory.bulkCreate(productCategory);

    return resp(201, "");
  }

  async update(product: IProduct, productId: string) {
    const { error } = schema.updateProduct.validate(product);
    if (error) return resp(400, error.message);

    const findProduct = await this.model.findByPk(productId);
    if (!findProduct) return respM(404, "Product not found");

    const categories = await Promise.all(
      product.categories!.map(async (id) => {
        return await Category.findByPk(id);
      })
    );
    if (categories.some((e) => !e)) return resp(400, "Category not found");

    await findProduct.update(product);

    await ProductCategory.destroy({ where: { productId } });

    const productCategory = product.categories!.map((id) => ({
      productId: productId,
      categoryId: id,
    }));

    await ProductCategory.bulkCreate(productCategory);

    return resp(200, findProduct);
  }

  async delete(productId: string) {
    const findProduct = (await this.model.findByPk(productId, {
      include: [{ model: Order, as: "orders" }],
    })) as Product & { orders: Order[] };
    if (!findProduct) return respM(404, "Product not found");
    if (findProduct.orders!.length > 0)
      return respM(400, "Product already in use");

    await findProduct.destroy();

    return resp(204, "");
  }

  async wishlist(productId: number, userId: number) {
    const findProduct = await this.model.findByPk(productId);
    if (!findProduct) return respM(404, "Product not found");

    const wishlist = await Wishlist.findOne({
      where: { productId, userId },
    });

    if (wishlist) {
      await wishlist.destroy();
      return resp(204, "");
    }

    await Wishlist.create({ productId, userId });
    return resp(201, "");
  }
}

export default ProductService;
