import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";
import Order from "./Order";

class OrderItem extends Model {
  declare id: number;
  declare order_id: number;
  declare product_id: number;
  declare quantity: number;
  declare price: number;
  declare created_at: Date;
  declare updated_at: Date;
}

OrderItem.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    order_id: {
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
    product_id: {
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
  { sequelize: db, tableName: "order_item", timestamps: false }
);

OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  as: "order_items",
});

export default OrderItem;
