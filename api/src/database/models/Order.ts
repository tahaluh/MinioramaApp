import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

class Order extends Model {
  declare id: number;
  declare user_id: number;
  declare status: string;
  declare total: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Order.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  { sequelize: db, tableName: "order" }
);

export default Order;
