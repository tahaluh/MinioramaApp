import { ModelStatic } from "sequelize";
import User from "../database/models/User";
import { resp, respM } from "../utils/resp";
import md5 from "md5";
import { sign } from "../jwt/jwt";
import IUser from "../interfaces/IUser";
import schema from "./validations/schema";

class UserService {
  private model: ModelStatic<User> = User;

  async get() {
    const users = await this.model.findAll({
      attributes: { exclude: ["password"] },
    });
    return resp(200, users);
  }

  async login(body: { email: string; password: string }) {
    const hashPassword = md5(body.password);

    const user = await this.model.findOne({
      where: {
        email: body.email,
        password: hashPassword,
      },
    });

    if (!user) return respM(404, "User not found");

    const { id, email, role } = user;
    const token = sign({ id, email, role });
    return resp(200, { id, email, token });
  }

  async create(user: IUser) {
    const { error } = schema.user.validate(user);
    if (error) return respM(400, error.message);

    const findUser = await this.model.findOne({
      where: {
        email: user.email,
      },
    });

    if (findUser) return respM(400, "User with this email already exists");

    const hashPassword = md5(user.password);
    const createdUser = await this.model.create({
      ...user,
      password: hashPassword,
    });

    return resp(201, createdUser);
  }

  async update(user: IUser, userId: number) {
    const { error } = schema.updateUser.validate(user);
    if (error) return respM(400, error.message);

    const findUser = await this.model.findOne({
      where: {
        id: userId,
      },
    });
    if (!findUser) return respM(404, "User not found");

    await findUser.update(user);

    return resp(204, "");
  }

  async changePassword(
    body: {
      oldPassword: string;
      newPassword: string;
    },
    userId: number
  ) {
    const { error } = schema.userChangePassword.validate(body);
    if (error) return respM(400, error.message);

    const { oldPassword, newPassword } = body;

    const hashOldPassword = md5(oldPassword);

    const user = await this.model.findOne({
      where: {
        id: userId,
      },
    });
    if (hashOldPassword !== user?.password)
      return respM(400, "Old password is incorrect");

    const hashPassword = md5(newPassword);

    await user.update({
      password: hashPassword,
    });

    return resp(204, "");
  }
}

export default UserService;
