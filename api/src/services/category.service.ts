import Category from "../database/models/Category";
import { ModelStatic } from "sequelize";

class CategoryService {
  private model: ModelStatic<Category> = Category;

  async get() {
    const categories = this.model.findAll();
  }
}
