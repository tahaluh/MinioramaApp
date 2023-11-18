import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import Product from "./Product";
import User from "./User";

class Wishlist extends Model {
  declare id: number;
  declare product_id: number;
  declare user_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Wishlist.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
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
    user_id: {
      type: sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  { sequelize: db, tableName: "wishlist", timestamps: false }
);

Product.belongsToMany(User, {
  foreignKey: "product_id",
  otherKey: "user_id",
  as: "users",
  through: Wishlist,
});

User.belongsToMany(Product, {
  foreignKey: "user_id",
  otherKey: "product_id",
  as: "products",
  through: Wishlist,
});

export default Wishlist;
