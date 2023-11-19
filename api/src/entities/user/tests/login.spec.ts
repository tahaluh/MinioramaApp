import UserService from "../user.service";
import { ModelStatic } from "sequelize";
import md5 from "md5";

jest.mock("../../../database/models/User", () => ({
  findOne: jest.fn(),
}));

describe("UserService - login", () => {
  let userService: UserService;
  let mockModel: ModelStatic<any>;

  beforeEach(() => {
    userService = new UserService();
    mockModel = require("../../../database/models/User") as ModelStatic<any>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 404 response when user is not found", async () => {
    (mockModel.findOne as jest.Mock).mockResolvedValue(null);

    const mockRequestBody = {
      email: "nonexistent@example.com",
      password: "nonexistentPassword",
    };

    const result = await userService.login(mockRequestBody);

    expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      where: {
        email: mockRequestBody.email,
        password: md5(mockRequestBody.password),
      },
    });

    expect(result.status).toBe(404);
    expect(result.message).toBe("User not found");
  });

  it("should return user data and token when login is successful", async () => {
    const mockUserData = {
      id: 1,
      email: "existent@example.com",
      role: "CUSTOMER",
    };

    const mockPassword = "password123";
    const hashedPassword = md5(mockPassword);

    (mockModel.findOne as jest.Mock).mockResolvedValue({
      ...mockUserData,
      password: hashedPassword,
    });

    const mockRequestBody = {
      email: "existent@example.com",
      password: mockPassword,
    };

    const result = await userService.login(mockRequestBody);

    expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      where: {
        email: mockRequestBody.email,
        password: md5(mockRequestBody.password),
      },
    });

    expect(result.status).toBe(200);
    expect(result.message).toHaveProperty("id", mockUserData.id);
    expect(result.message).toHaveProperty("email", mockUserData.email);
    expect(result.message).toHaveProperty("token");
  });
});
