import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import Product from "./Product";
import Category from "./Category";

class ProductCategory extends Model {
  declare id: number;
  declare productId: number;
  declare categoryId: number;
}

ProductCategory.init(
  {
    productId: {
      type: sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "product",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      primaryKey: true,
    },
    categoryId: {
      type: sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "category",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      primaryKey: true,
    },
  },
  {
    sequelize: db,
    tableName: "product_category",
    timestamps: false,
    underscored: true,
  }
);

Product.belongsToMany(Category, {
  foreignKey: "productId",
  otherKey: "categoryId",
  as: "categories",
  through: ProductCategory,
});

Category.belongsToMany(Product, {
  foreignKey: "categoryId",
  otherKey: "productId",
  as: "products",
  through: ProductCategory,
});

export default ProductCategory;
