import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

class Product extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageUrl: string;
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
    imageUrl: {
      type: sequelize.STRING,
      allowNull: true,
    },
  },
  { sequelize: db, tableName: "product", timestamps: true, underscored: true }
);

export default Product;
