import Category from "../../database/models/Category";
import { ModelStatic } from "sequelize";
import { resp } from "../../utils/resp";
import Product from "../../database/models/Product";
import createCategoryValidation from "./validations/createCategory";
import updateCategoryValidation from "./validations/updateCategory";

class CategoryService {
  private model: ModelStatic<Category> = Category;

  async get() {
    const categories = await this.model.findAll();

    return resp(201, categories);
  }

  async create(name: string) {
    const { error } = createCategoryValidation.validate({ name });
    if (error) return resp(400, error.message);

    const findCategory = await this.model.findOne({ where: { name } });
    if (findCategory)
      return resp(400, "Category with this name already exists");

    await this.model.create({ name });

    return resp(201, "");
  }

  async update(categoryId: number, name: string) {
    const { error } = updateCategoryValidation.validate({ name });
    if (error) return resp(400, error.message);

    const findOldCategory = await this.model.findByPk(categoryId);
    if (!findOldCategory) return resp(404, "Category not found");

    const findCategory = await this.model.findOne({ where: { name } });
    if (findCategory && findCategory.id != findOldCategory.id)
      return resp(400, "Category with this name already exists");

    findOldCategory.update({ name });

    return resp(203, "");
  }

  async delete(categoryId: number) {
    const findCategory = (await this.model.findByPk(categoryId, {
      include: [{ model: Product, as: "products" }],
    })) as Category & { products: Product[] };
    if (!findCategory) return resp(404, "Category not found");

    if (!(findCategory.products.length === 0))
      return resp(404, "Category already in use");

    await findCategory.destroy();

    return resp(203, "");
  }
}

export default CategoryService;
