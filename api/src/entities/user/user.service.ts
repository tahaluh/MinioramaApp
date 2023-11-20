import { ModelStatic, Op } from "sequelize";
import User from "../../database/models/User";
import { resp } from "../../utils/resp";
import md5 from "md5";
import { sign } from "../../jwt/jwt";
import CreateUserDTO from "./dto/createUserDTO";
import UpdateUserDTO from "./dto/UpdateUserDTO";
import createUserValidation from "./validations/createUser";
import updateUserValidation from "./validations/updateUser";
import changepasswordValidation from "./validations/changepassword";

class UserService {
  private model: ModelStatic<User> = User;

  async get(page: number = 0, limit: number = 25, search: string = "") {
    const searchWhereCondition: any = {};

    if (search !== "") {
      searchWhereCondition[Op.or] = [
        { name: { [Op.substring]: search } },
        { email: { [Op.substring]: search } },
      ];
    }

    const users = await this.model.findAll({
      attributes: { exclude: ["password"] },
      where: searchWhereCondition,
      limit,
      offset: page * limit,
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

    if (!user) return resp(404, "User not found");

    const { id, email, role } = user;
    const token = sign({ id, email, role });
    return resp(200, { id, email, token });
  }

  async create(data: CreateUserDTO) {
    const { error } = createUserValidation.validate(data);
    if (error) return resp(400, error.message);

    const findUser = await this.model.findOne({
      where: {
        email: data.email,
      },
    });

    if (findUser) return resp(400, "User with this email already exists");

    const hashPassword = md5(data.password);
    const createdUser = await this.model.create({
      ...data,
      password: hashPassword,
    });

    return resp(201, createdUser);
  }

  async update(data: UpdateUserDTO, userId: number) {
    const { error } = updateUserValidation.validate(data);
    if (error) return resp(400, error.message);

    const findUser = await this.model.findOne({
      where: {
        id: userId,
      },
    });
    if (!findUser) return resp(404, "User not found");

    await findUser.update(data);

    return resp(204, "");
  }

  async changePassword(
    body: {
      oldPassword: string;
      newPassword: string;
    },
    userId: number
  ) {
    const { error } = changepasswordValidation.validate(body);
    if (error) return resp(400, error.message);

    const { oldPassword, newPassword } = body;

    const hashOldPassword = md5(oldPassword);

    const user = await this.model.findOne({
      where: {
        id: userId,
      },
    });
    if (hashOldPassword !== user?.password)
      return resp(400, "Old password is incorrect");

    const hashPassword = md5(newPassword);

    await user.update({
      password: hashPassword,
    });

    return resp(204, "");
  }
}

export default UserService;
