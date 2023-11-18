import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

class Product extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare price: number;
  declare image_url: string;
  declare created_at: Date;
  declare updated_at: Date;
}

Product.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: sequelize.STRING,
      allowNull: false,
    },
    image_url: {
      type: sequelize.STRING,
      allowNull: true,
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
  { sequelize: db, tableName: "product" }
);

export default Product;
