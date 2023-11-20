import CartService from "../cart.service";
import { ModelStatic } from "sequelize";

jest.mock("../../../database/models/Product", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../../database/models/Cart", () => ({
  findOne: jest.fn(),
  update: jest.fn(),
}));

describe("CartService - update", () => {
  let cartService: CartService;
  let mockProductModel: ModelStatic<any>;
  let mockCartModel: ModelStatic<any>;

  beforeEach(() => {
    cartService = new CartService();
    mockProductModel =
      require("../../../database/models/Product") as ModelStatic<any>;
    mockCartModel =
      require("../../../database/models/Cart") as ModelStatic<any>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if product is not found", async () => {
    const productId = 1;
    const userId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await cartService.update(productId, userId, 1);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);

    expect(result.status).toBe(404);
    expect(result.message).toBe("Product not found");
  });

  it("should return 404 if product is not found in cart", async () => {
    const productId = 1;
    const userId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({});
    (mockCartModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await cartService.update(productId, userId, 1);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);

    expect(mockCartModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockCartModel.findOne).toHaveBeenCalledWith({
      where: { productId, userId },
    });

    expect(result.status).toBe(404);
    expect(result.message).toBe("Product not found in cart");
  });

  it("should return 400 if quantity is less than 1", async () => {
    const productId = 1;
    const userId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({});
    (mockCartModel.findOne as jest.Mock).mockResolvedValue({});

    const result = await cartService.update(productId, userId, 0);

    expect(result.status).toBe(400);
    expect(result.message).toBe("Quantity must be greater than 0");
  });

  it("should update quantity in the cart", async () => {
    const productId = 1;
    const userId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({});
    (mockCartModel.findOne as jest.Mock).mockResolvedValue({
      update: jest.fn().mockResolvedValue({}),
    });

    const result = await cartService.update(productId, userId, 2);

    expect(mockCartModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockCartModel.findOne).toHaveBeenCalledWith({
      where: { productId, userId },
    });

    expect(result.status).toBe(204);
    expect(result.message).toBe("");
  });
});
