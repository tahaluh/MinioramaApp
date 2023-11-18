import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import User from "./User";
import Product from "./Product";

class Cart extends Model {
  declare id: number;
  declare product_id: number;
  declare quantity: number;
  declare user_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Cart.init(
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
    quantity: {
      type: sequelize.INTEGER,
      allowNull: false,
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
    created_at: {
      type: sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  },
  { sequelize: db, tableName: "cart" }
);

User.hasMany(Cart, {
  foreignKey: "user_id",
  as: "carts",
});

Cart.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Product.hasMany(Cart, {
  foreignKey: "product_id",
  as: "product",
});

Cart.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

export default Cart;
