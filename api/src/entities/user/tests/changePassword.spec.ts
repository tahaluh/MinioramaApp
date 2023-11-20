import UserService from "../user.service";
import { ModelStatic } from "sequelize";
import md5 from "md5";

jest.mock("../../../database/models/User", () => ({
  findOne: jest.fn(),
}));

let userService: UserService;
let mockModel: ModelStatic<any>;

beforeEach(() => {
  userService = new UserService();
  mockModel = require("../../../database/models/User") as ModelStatic<any>;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("UserService - changePassword", () => {
  it("should return a 400 response when validation fails", async () => {
    const mockUserId = 1;
    const mockRequestBody = {
      oldPassword: "oldPassword",
      newPassword: "new",
    };

    const error = {
      message: '"newPassword" length must be at least 6 characters long',
    };

    const result = await userService.changePassword(
      mockRequestBody,
      mockUserId
    );

    expect(result.status).toBe(400);
    expect(result.message).toBe(error.message);
  });

  it("should return a 400 response when old password is incorrect", async () => {
    const mockUserId = 1;
    const mockRequestBody = {
      oldPassword: "oldPassword",
      newPassword: "newPassword",
    };

    const hashedOldPassword = md5("wrongPassword");

    (mockModel.findOne as jest.Mock).mockResolvedValue({
      id: mockUserId,
      password: hashedOldPassword,
      update: jest.fn().mockResolvedValue([1]),
    });

    const result = await userService.changePassword(
      mockRequestBody,
      mockUserId
    );

    expect(result.status).toBe(400);
    expect(result.message).toBe("Old password is incorrect");
  });

  it("should change the user's password successfully", async () => {
    const mockUserId = 1;
    const mockRequestBody = {
      oldPassword: "oldPassword",
      newPassword: "newPassword",
    };

    const hashedOldPassword = md5(mockRequestBody.oldPassword);

    (mockModel.findOne as jest.Mock).mockResolvedValue({
      id: mockUserId,
      password: hashedOldPassword,
      update: jest.fn().mockResolvedValue([1]),
    });

    const result = await userService.changePassword(
      mockRequestBody,
      mockUserId
    );

    expect(result.status).toBe(200);
    expect(result.message).toBe("Updated");
  });
});
