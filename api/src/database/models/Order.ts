import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
}

class Order extends Model {
  declare id: number;
  declare userId: number;
  declare status: OrderStatus;
  declare total: number;
}

Order.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    },
    status: {
      type: sequelize.ENUM("pending", "success", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    total: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  { sequelize: db, tableName: "order", timestamps: true, underscored: true }
);

export default Order;
