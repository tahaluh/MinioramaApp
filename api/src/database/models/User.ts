import { Model } from "sequelize";
import db from ".";
import sequelize from "sequelize";

export enum UserRoles {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

class User extends Model {
  declare id: number;
  declare role: UserRoles;
  declare name: string;
  declare email: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role: {
      type: sequelize.ENUM("ADMIN", "CUSTOMER"),
      allowNull: false,
      defaultValue: "CUSTOMER",
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
