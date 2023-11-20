import CartService from "../cart.service";
import { ModelStatic } from "sequelize";

jest.mock("../../../database/models/Product", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../../database/models/Cart", () => ({
  findOne: jest.fn(),
  destroy: jest.fn(),
}));

describe("CartService - delete", () => {
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

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await cartService.delete(productId, 1);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);

    expect(result.status).toBe(404);
    expect(result.message).toBe("Product not found");
  });

  it("should return 404 if product is not found in cart", async () => {
    const productId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({});
    (mockCartModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await cartService.delete(productId, 1);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);

    expect(mockCartModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockCartModel.findOne).toHaveBeenCalledWith({
      where: { productId },
    });

    expect(result.status).toBe(404);
    expect(result.message).toBe("Product not found in cart");
  });

  it("should delete product from the cart", async () => {
    const productId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({});
    (mockCartModel.findOne as jest.Mock).mockResolvedValue({
      destroy: jest.fn().mockResolvedValue({}),
    });

    const result = await cartService.delete(productId, 1);

    expect(mockCartModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockCartModel.findOne).toHaveBeenCalledWith({
      where: { productId },
    });

    expect(result.status).toBe(204);
    expect(result.message).toBe("");
  });
});
