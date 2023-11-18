import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import Product from "./Product";
import User from "./User";

class Wishlist extends Model {
  declare id: number;
  declare productId: number;
  declare userId: number;
}

Wishlist.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
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
    userId: {
      type: sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      primaryKey: true,
    },
  },
  { sequelize: db, tableName: "wishlist", timestamps: false, underscored: true }
);

Product.belongsToMany(User, {
  foreignKey: "productId",
  otherKey: "userId",
  as: "users",
  through: Wishlist,
});

User.belongsToMany(Product, {
  foreignKey: "userId",
  otherKey: "productId",
  as: "products",
  through: Wishlist,
});

export default Wishlist;
