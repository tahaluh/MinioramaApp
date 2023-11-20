import OrderService from "../order.service";
import Order from "../../../database/models/Order";
import { ModelStatic } from "sequelize";
import Product from "../../../database/models/Product";
import UserRoles from "../../../types/userRoles";

jest.mock("../../../database/models/Order", () => ({
  findAll: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Product", () => ({
  findAll: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/User", () => ({
  belongsToMany: jest.fn(),
}));

describe("OrderService - get", () => {
  let orderService: OrderService;
  let mockOrderModel: jest.Mocked<ModelStatic<Order>>;
  let mockProductModel: jest.Mocked<ModelStatic<Product>>;

  beforeEach(() => {
    orderService = new OrderService();
    mockOrderModel = require("../../../database/models/Order") as jest.Mocked<
      ModelStatic<Order>
    >;
    mockProductModel =
      require("../../../database/models/Product") as jest.Mocked<
        ModelStatic<Product>
      >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get orders for an admin user", async () => {
    const userId = 1;
    const userIdTk = 1;
    const role = UserRoles.ADMIN;

    const mockOrders = [{ id: 1 }, { id: 2 }];

    (mockOrderModel.findAll as jest.Mock).mockResolvedValue(mockOrders);

    const result = await orderService.get(userIdTk, role, userId);

    expect(mockOrderModel.findAll).toHaveBeenCalledTimes(1);
    expect(mockOrderModel.findAll).toHaveBeenCalledWith({
      where: { userId },
      include: [{ model: mockProductModel, as: "products" }],
    });

    expect(result.status).toBe(200);
    expect(result.message).toEqual(mockOrders);
  });

  it("should handle unauthorized access for non-admin users", async () => {
    const userId = 2;
    const userIdTk = 1;
    const role = UserRoles.CUSTOMER;

    const result = await orderService.get(userIdTk, role, userId);

    expect(mockOrderModel.findAll).toHaveBeenCalledTimes(0);

    expect(result.status).toBe(401);
    expect(result.message).toBe("Unauthorized");
  });
});
