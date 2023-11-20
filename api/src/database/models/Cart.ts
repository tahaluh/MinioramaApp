import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import User from "./User";
import Product from "./Product";

class Cart extends Model {
  declare id: number;
  declare productId: number;
  declare quantity: number;
  declare userId: number;
}

Cart.init(
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
    quantity: {
      type: sequelize.INTEGER,
      allowNull: false,
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
  { sequelize: db, tableName: "cart", timestamps: false, underscored: true }
);

Product.belongsToMany(User, {
  foreignKey: "productId",
  otherKey: "userId",
  as: "cartUsers",
  through: Cart,
});

User.belongsToMany(Product, {
  foreignKey: "userId",
  otherKey: "productId",
  as: "cartProducts",
  through: Cart,
});

Cart.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

export default Cart;
