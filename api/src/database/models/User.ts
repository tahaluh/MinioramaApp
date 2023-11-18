import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare created_at: Date;
  declare updated_at: Date;
}

User.init(
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
    email: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
    },
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  { sequelize: db, tableName: "user", timestamps: true, underscored: true }
);

export default User;
