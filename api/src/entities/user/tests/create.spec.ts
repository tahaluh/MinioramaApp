import { ModelStatic } from "sequelize";
import md5 from "md5";
import UserService from "../user.service";

jest.mock("../../../database/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const mockUser = {
  name: "John Doe",
  email: "johndoe@example.com",
  password: "password123",
};

describe("UserService - create", () => {
  let userService: UserService;
  let mockModel: ModelStatic<any>;

  beforeEach(() => {
    userService = new UserService();
    mockModel = require("../../../database/models/User") as ModelStatic<any>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    (mockModel.findOne as jest.Mock).mockResolvedValue(null);
    (mockModel.create as jest.Mock).mockImplementation((userData: any) =>
      Promise.resolve(userData)
    );

    const result = await userService.create(mockUser);

    expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      where: {
        email: mockUser.email,
      },
    });
    expect(mockModel.create).toHaveBeenCalledTimes(1);
    expect(mockModel.create).toHaveBeenCalledWith({
      ...mockUser,
      password: md5(mockUser.password),
    });
    expect(result.status).toBe(201);
    expect(result.message).toEqual({
      ...mockUser,
      password: md5(mockUser.password),
    });
  });

  it("should return an error if user already exists", async () => {
    (mockModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (mockModel.create as jest.Mock).mockImplementation((userData: any) =>
      Promise.resolve(userData)
    );

    const result = await userService.create(mockUser);

    expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      where: {
        email: mockUser.email,
      },
    });
    expect(mockModel.create).toHaveBeenCalledTimes(0);
    expect(result.status).toBe(400);
    expect(result.message).toBe("User with this email already exists");
  });

  it("should return an error if password is not 6 characters long", async () => {
    (mockModel.findOne as jest.Mock).mockResolvedValue(null);
    (mockModel.create as jest.Mock).mockImplementation((userData: any) =>
      Promise.resolve(userData)
    );

    const result = await userService.create({
      ...mockUser,
      password: "123",
    });

    expect(mockModel.findOne).toHaveBeenCalledTimes(0);
    expect(mockModel.create).toHaveBeenCalledTimes(0);
    expect(result.status).toBe(400);
    expect(result.message).toBe(
      '"password" length must be at least 6 characters long'
    );
  });

  it("should return an error if email is invalid", async () => {
    (mockModel.findOne as jest.Mock).mockResolvedValue(null);
    (mockModel.create as jest.Mock).mockImplementation((userData: any) =>
      Promise.resolve(userData)
    );

    const result = await userService.create({
      ...mockUser,
      email: "invalidEmail",
    });

    expect(mockModel.findOne).toHaveBeenCalledTimes(0);
    expect(mockModel.create).toHaveBeenCalledTimes(0);
    expect(result.status).toBe(400);
    expect(result.message).toBe('"email" must be a valid email');
  });
});
