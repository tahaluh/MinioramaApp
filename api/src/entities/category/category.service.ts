import Category from "../../database/models/Category";
import { ModelStatic } from "sequelize";
import { resp, respM } from "../../utils/resp";
import Product from "../../database/models/Product";

class CategoryService {
  private model: ModelStatic<Category> = Category;

  async get() {
    const categories = await this.model.findAll();

    return respM(201, categories);
  }

  async create(name: string) {
    const findCategory = await this.model.findOne({ where: { name } });
    if (findCategory)
      return respM(400, "Category with this name already exists");

    await this.model.create({ name });

    return resp(201, "");
  }

  async update(categoryId: number, name: string) {
    const findOldCategory = await this.model.findByPk(categoryId);
    if (!findOldCategory) return respM(404, "Category not found");

    const findCategory = await this.model.findOne({ where: { name } });
    if (findCategory && findCategory.id != findOldCategory.id)
      return respM(400, "Category with this name already exists");

    findOldCategory.update({ name });

    return resp(203, "");
  }

  async delete(categoryId: number) {
    const findCategory = (await this.model.findByPk(categoryId, {
      include: [{ model: Product, as: "products" }],
    })) as Category & { products: Product[] };
    if (!findCategory) return respM(404, "Category not found");

    if (!(findCategory.products.length === 0))
      return respM(404, "Category already in use");

    await findCategory.destroy();

    return resp(203, "");
  }
}

export default CategoryService;