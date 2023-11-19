import { ModelStatic } from "sequelize";
import UserService from "../user.service";

jest.mock("../../../database/models/User", () => ({
  findOne: jest.fn(),
  update: jest.fn(),
}));

const mockUser = {
  name: "John Doe",
  email: "johndoe@example.com",
};

describe("UserService - update", () => {
  let userService: UserService;
  let mockModel: ModelStatic<any>;

  beforeEach(() => {
    userService = new UserService();
    mockModel = require("../../../database/models/User") as ModelStatic<any>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a user", async () => {
    const userId = 1;
    const updatedUser = {
      name: "Updated Name",
      email: "updatedemail@example.com",
    };

    (mockModel.findOne as jest.Mock).mockResolvedValue({
      id: userId,
      ...mockUser,
      update: jest.fn().mockResolvedValue([1]),
    });

    const result = await userService.update(updatedUser, userId);

    expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });

    expect(result.status).toBe(204);
    expect(result.message).toBe("");
  });

  it("should return 404 if user is not found", async () => {
    const userId = 1;

    (mockModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await userService.update(mockUser, userId);

    expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
    expect(result.status).toBe(404);
    expect(result.message).toBe("User not found");
  });

  it("should return 400 if validation fails", async () => {
    const userId = 1;
    const updatedUser = {
      // Invalid user data for testing validation failure
      name: "Updated Name",
      email: "invalidemail", // Invalid email for validation failure
      password: "pass", // Invalid password length for validation failure
    };

    const validationResult = {
      error: new Error('"email" must be a valid email'),
    };

    (mockModel.findOne as jest.Mock).mockResolvedValue({ id: userId });

    const result = await userService.update(updatedUser, userId);

    expect(result.status).toBe(400);
    expect(result.message).toBe('"email" must be a valid email');
  });
});
