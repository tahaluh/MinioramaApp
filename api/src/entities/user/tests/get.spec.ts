import UserService from "../user.service";
import { ModelStatic } from "sequelize";

jest.mock("../../../database/models/User", () => ({
  findAll: jest.fn(),
}));

describe("UserService", () => {
  let userService: UserService;
  let mockModel: ModelStatic<any>;

  beforeEach(() => {
    userService = new UserService();
    mockModel = require("../../../database/models/User") as ModelStatic<any>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get users excluding password", async () => {
    const mockUsers = [
      { id: 1, username: "user1", password: "pass1" },
      { id: 2, username: "user2", password: "pass2" },
    ];

    // Configuração do mock para o método findAll
    (mockModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const result = await userService.get();

    expect(mockModel.findAll).toHaveBeenCalledTimes(1);
    expect(mockModel.findAll).toHaveBeenCalledWith({
      attributes: { exclude: ["password"] },
      limit: 25,
      offset: 0,
      where: {},
    });
    expect(result.status).toBe(200);
    expect(result.message).toEqual(mockUsers);
  });
});
