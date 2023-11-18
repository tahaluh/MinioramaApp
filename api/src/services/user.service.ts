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
    const users = await this.model.findAll();
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

    const { id, email } = user;
    const token = sign({ id, email });
    return resp(200, { id, email, token });
  }

  async create(user: IUser) {
    const { error } = schema.user.validate(user);
    if (error) return respM(400, error.message);

    const hashPassword = md5(user.password);
    const createdUser = await this.model.create({
      ...user,
      password: hashPassword,
    });

    return resp(201, createdUser);
  }
}

export default UserService;
