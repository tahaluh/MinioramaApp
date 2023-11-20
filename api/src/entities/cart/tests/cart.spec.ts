import CartService from "../cart.service";
import { ModelStatic } from "sequelize";

jest.mock("../../../database/models/Product", () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Cart", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  belongsToMany: jest.fn(),
  update: jest.fn(),
}));

const mockProduct = {
  id: 1,
  name: "Product 1",
  description: "Product 1 description",
  price: 10,
  imageUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("CartService - cart", () => {
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

  it("should add a product to the cart if it's not already present", async () => {
    const productId = 1;
    const userId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({ mockProduct });

    (mockCartModel.findOne as jest.Mock).mockResolvedValue(null);

    (mockCartModel.create as jest.Mock).mockImplementation((data: any) => {
      return Promise.resolve({ ...data, id: 1 });
    });

    const result = await cartService.cart(productId, userId);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);

    expect(mockCartModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockCartModel.findOne).toHaveBeenCalledWith({
      where: { productId, userId },
    });

    expect(mockCartModel.create).toHaveBeenCalledTimes(1);
    expect(mockCartModel.create).toHaveBeenCalledWith({
      productId,
      userId,
      quantity: 1,
    });

    expect(result.status).toBe(201);
    expect(result.message).toBe("Created");
  });

  it("should update the quantity of a product already present in the cart", async () => {
    const productId = 1;
    const userId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({
      mockProduct,
    });

    const existingCart = {
      id: 1,
      productId,
      userId,
      quantity: 1,
      update: jest.fn(),
    };
    (mockCartModel.findOne as jest.Mock).mockResolvedValue(existingCart);
    (existingCart.update as jest.Mock).mockResolvedValue({});

    const result = await cartService.cart(productId, userId);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);

    expect(mockCartModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockCartModel.findOne).toHaveBeenCalledWith({
      where: { productId, userId },
    });

    expect(existingCart.update).toHaveBeenCalledTimes(1);
    expect(existingCart.update).toHaveBeenCalledWith({
      quantity: existingCart.quantity + 1,
    });

    expect(result.status).toBe(200);
    expect(result.message).toBe("Updated");
  });

  it("should return a 404 if the product is not found", async () => {
    const productId = 1;
    const userId = 1;

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await cartService.cart(productId, userId);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);

    expect(result.status).toBe(404);
    expect(result.message).toBe("Product not found");
  });
});
