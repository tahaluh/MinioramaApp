import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import Order from "./Order";
import Product from "./Product";

class ProductOrder extends Model {
  declare id: number;
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
  declare price: number;
}

ProductOrder.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    orderId: {
      type: sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "order",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      primaryKey: true,
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
    price: {
      type: sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "order_item",
    timestamps: false,
    underscored: true,
  }
);

Product.belongsToMany(Order, {
  foreignKey: "productId",
  otherKey: "orderId",
  as: "orders",
  through: ProductOrder,
});

Order.belongsToMany(Product, {
  foreignKey: "orderId",
  otherKey: "productId",
  as: "products",
  through: ProductOrder,
});

export default ProductOrder;
