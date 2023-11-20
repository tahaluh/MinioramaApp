import { ModelStatic } from "sequelize";
import OrderService from "../order.service";
import Product from "../../../database/models/Product";
import User from "../../../database/models/User";
import Cart from "../../../database/models/Cart";
import Order from "../../../database/models/Order";
import ProductOrder from "../../../database/models/ProductOrder";

jest.mock("../../../database/models/User", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../../database/models/Product", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../../database/models/Cart", () => ({
  destroy: jest.fn(),
}));

jest.mock("../../../database/models/Order", () => ({
  create: jest.fn(),
}));

jest.mock("../../../database/models/ProductOrder", () => ({
  bulkCreate: jest.fn(),
}));

describe("OrderService - create", () => {
  let orderService: OrderService;
  let mockOrderModel: ModelStatic<Order>;
  let mockUserModel: ModelStatic<User>;
  let mockProductModel: ModelStatic<Product>;
  let mockCartModel: ModelStatic<Cart>;
  let mockProductOrderModel: ModelStatic<ProductOrder>;

  beforeEach(() => {
    orderService = new OrderService();
    mockOrderModel =
      require("../../../database/models/Order") as ModelStatic<Order>;
    mockUserModel =
      require("../../../database/models/User") as ModelStatic<User>;
    mockProductModel =
      require("../../../database/models/Product") as ModelStatic<Product>;
    mockCartModel =
      require("../../../database/models/Cart") as ModelStatic<Cart>;
    mockProductOrderModel =
      require("../../../database/models/ProductOrder") as ModelStatic<ProductOrder>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an order for a user with items in the cart", async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      cartProducts: [
        {
          id: 1,
          price: 20,
          Cart: { quantity: 2 },
        },
        {
          id: 2,
          price: 15,
          Cart: { quantity: 3 },
        },
      ],
    };

    (mockUserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);
    (mockOrderModel.create as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await orderService.create(userId);

    expect(mockUserModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId, {
      include: [{ model: mockProductModel, as: "cartProducts" }],
    });

    expect(mockOrderModel.create).toHaveBeenCalledTimes(1);
    expect(mockOrderModel.create).toHaveBeenCalledWith({ userId, total: 85 });

    expect(mockProductOrderModel.bulkCreate).toHaveBeenCalledTimes(1);
    expect(mockCartModel.destroy).toHaveBeenCalledTimes(1);

    expect(result.status).toBe(201);
    expect(result.message).toEqual({ id: 1 });
  });

  it("should return 404 if the user is not found", async () => {
    const userId = 1;

    (mockUserModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await orderService.create(userId);

    expect(mockUserModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId, {
      include: [{ model: mockProductModel, as: "cartProducts" }],
    });

    expect(mockOrderModel.create).not.toHaveBeenCalled();
    expect(mockProductOrderModel.bulkCreate).not.toHaveBeenCalled();
    expect(mockCartModel.destroy).not.toHaveBeenCalled();

    expect(result.status).toBe(404);
    expect(result.message).toBe("User not found");
  });

  it("should return 400 if the user's cart is empty", async () => {
    const userId = 1;
    const mockUser = { id: userId, cartProducts: [] };

    (mockUserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

    const result = await orderService.create(userId);

    expect(mockUserModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId, {
      include: [{ model: mockProductModel, as: "cartProducts" }],
    });

    expect(mockOrderModel.create).not.toHaveBeenCalled();
    expect(mockProductOrderModel.bulkCreate).not.toHaveBeenCalled();
    expect(mockCartModel.destroy).not.toHaveBeenCalled();

    expect(result.status).toBe(400);
    expect(result.message).toBe("Cart is empty");
  });
});
