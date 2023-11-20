import { ModelStatic, Op } from "sequelize";
import Product from "../../database/models/Product";
import Category from "../../database/models/Category";
import { resp } from "../../utils/resp";
import ProductCategory from "../../database/models/ProductCategory";
import Wishlist from "../../database/models/Wishlist";
import Order from "../../database/models/Order";
import CreateProductDTO from "./dto/createProductDTO";
import UpdateProductDTO from "./dto/updateProductDTO";
import updateProductValidation from "./validations/updateProduct";
import createProductValidation from "./validations/createProduct";
import User from "../../database/models/User";

ProductCategory.associations;

class ProductService {
  private model: ModelStatic<Product> = Product;

  async get(
    page: number = 0,
    limit: number = 25,
    categories: string[] = [],
    search: string = ""
  ) {
    const searchWhereCondition: any = {};
    const categoriesWhereCondition: any = {};

    if (search !== "") {
      searchWhereCondition[Op.or] = [
        { name: { [Op.substring]: search } },
        { description: { [Op.substring]: search } },
      ];
    }

    if (categories.length > 0) {
      categoriesWhereCondition[Op.or] = categories.map((e) => ({
        id: e,
      }));
    }

    const products = await this.model.findAll({
      include: [
        {
          model: Category,
          as: "categories",
          where: categoriesWhereCondition,
        },
      ],
      where: searchWhereCondition,
      limit,
      offset: page * limit,
    });

    return resp(200, products);
  }

  async create(data: CreateProductDTO) {
    const { error } = createProductValidation.validate(data);
    if (error) return resp(400, error.message);

    const categories = await Promise.all(
      data.categories!.map(async (id) => {
        return await Category.findByPk(id);
      })
    );

    if (categories.some((e) => !e)) return resp(404, "Category not found");

    const createdProduct = await this.model.create({
      ...data,
    });

    const productCategory = data.categories!.map((id) => ({
      productId: createdProduct.id,
      categoryId: id,
    }));

    await ProductCategory.bulkCreate(productCategory);

    return resp(201, "Created");
  }

  async update(product: UpdateProductDTO, productId: string) {
    const { error } = updateProductValidation.validate(product);
    if (error) return resp(400, error.message);

    const findProduct = await this.model.findByPk(productId);
    if (!findProduct) return resp(404, "Product not found");

    const categories = await Promise.all(
      product.categories!.map(async (id) => {
        return await Category.findByPk(id);
      })
    );
    if (categories.some((e) => !e)) return resp(404, "Category not found");

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
    if (!findProduct) return resp(404, "Product not found");
    if (findProduct.orders!.length > 0)
      return resp(400, "Product already in use");

    await findProduct.destroy();

    return resp(204, "");
  }

  async getWishlist(
    userId: number,
    page: number = 0,
    limit: number = 25,
    search: string = ""
  ) {
    const findUser = await User.findByPk(userId);
    if (!findUser) return resp(404, "User not found");

    const searchWhereCondition: any = {};

    if (search !== "") {
      searchWhereCondition[Op.or] = [
        { name: { [Op.substring]: search } },
        { description: { [Op.substring]: search } },
      ];
    }

    const wishlistProducts = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          where: searchWhereCondition,
        },
      ],
      limit,
      offset: page * limit,
    });

    return resp(200, wishlistProducts || []);
  }

  async wishlist(productId: number, userId: number) {
    const findProduct = await this.model.findByPk(productId);
    if (!findProduct) return resp(404, "Product not found");

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
