import { ModelStatic } from "sequelize";
import OrderService from "../order.service";
import Order from "../../../database/models/Order";
import OrderStatus from "../../../types/orderStatus";

jest.mock("../../../database/models/Order", () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Product", () => ({
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/User", () => ({
  belongsToMany: jest.fn(),
}));

describe("OrderService - cancel", () => {
  let orderService: OrderService;
  let mockOrderModel: ModelStatic<Order>;

  beforeEach(() => {
    orderService = new OrderService();
    mockOrderModel =
      require("../../../database/models/Order") as ModelStatic<Order>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should cancel an order for the authenticated user", async () => {
    const orderId = 1;
    const userId = 1;
    const mockOrder = {
      id: orderId,
      userId,
      status: OrderStatus.PENDING,
      update: jest.fn().mockResolvedValue({}),
    };

    (mockOrderModel.findByPk as jest.Mock).mockResolvedValue(mockOrder);

    const result = await orderService.cancel(orderId, userId);

    expect(mockOrderModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockOrderModel.findByPk).toHaveBeenCalledWith(orderId);

    expect(mockOrder.update).toHaveBeenCalledTimes(1);
    expect(mockOrder.update).toHaveBeenCalledWith({
      status: OrderStatus.CANCELED,
    });

    expect(result.status).toBe(203);
    expect(result.message).toBe("");
  });

  it("should return 404 if the order is not found", async () => {
    const orderId = 1;
    const userId = 1;

    (mockOrderModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await orderService.cancel(orderId, userId);

    expect(mockOrderModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockOrderModel.findByPk).toHaveBeenCalledWith(orderId);

    expect(result.status).toBe(404);
    expect(result.message).toBe("Order not found");
  });

  it("should return 401 if the user is not authorized to cancel the order", async () => {
    const orderId = 1;
    const userId = 2;
    const mockOrder = { id: orderId, userId: 1 };

    (mockOrderModel.findByPk as jest.Mock).mockResolvedValue(mockOrder);

    const result = await orderService.cancel(orderId, userId);

    expect(mockOrderModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockOrderModel.findByPk).toHaveBeenCalledWith(orderId);

    expect(result.status).toBe(401);
    expect(result.message).toBe("Unauthorized");
  });

  it("should return 400 if the order cannot be canceled due to its status", async () => {
    const orderId = 1;
    const userId = 1;
    const mockOrder = { id: orderId, userId, status: OrderStatus.DELIVERED };

    (mockOrderModel.findByPk as jest.Mock).mockResolvedValue(mockOrder);

    const result = await orderService.cancel(orderId, userId);

    expect(mockOrderModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockOrderModel.findByPk).toHaveBeenCalledWith(orderId);

    expect(result.status).toBe(400);
    expect(result.message).toBe("Order cannot be canceled");
  });
});
