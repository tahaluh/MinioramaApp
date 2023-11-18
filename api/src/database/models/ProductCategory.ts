import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import Product from "./Product";
import Category from "./Category";

class ProductCategory extends Model {
  declare id: number;
  declare product_id: number;
  declare category_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

ProductCategory.init(
  {
    product_id: {
      type: sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "product",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    category_id: {
      type: sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "category",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  { sequelize: db, tableName: "product_category" }
);

Product.belongsToMany(Category, {
  foreignKey: "product_id",
  otherKey: "category_id",
  as: "categories",
  through: ProductCategory,
});

Category.belongsToMany(Product, {
  foreignKey: "category_id",
  otherKey: "product_id",
  as: "products",
  through: ProductCategory,
});

export default ProductCategory;
