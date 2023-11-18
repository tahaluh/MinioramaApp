import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

class Category extends Model {
  declare id: number;
  declare name: string;
}

Category.init(
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
  },
  { sequelize: db, tableName: "category", timestamps: false, underscored: true }
);

export default Category;
