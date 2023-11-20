import ProductService from "../product.service";
import Product from "../../../database/models/Product";
import Order from "../../../database/models/Order";
import { ModelStatic } from "sequelize";

jest.mock("../../../database/models/Product", () => ({
  findByPk: jest.fn(),
  destroy: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Order", () => ({
  findAll: jest.fn(),
}));

jest.mock("../../../database/models/Category", () => ({
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/User", () => ({
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Wishlist", () => ({
  belongsTo: jest.fn(),
}));

describe("ProductService - delete", () => {
  let productService: ProductService;
  let mockProductModel: jest.Mocked<ModelStatic<Product>>;
  let mockOrderModel: jest.Mocked<ModelStatic<Order>>;

  beforeEach(() => {
    productService = new ProductService();
    mockProductModel =
      require("../../../database/models/Product") as jest.Mocked<
        ModelStatic<Product>
      >;
    mockOrderModel = require("../../../database/models/Order") as jest.Mocked<
      ModelStatic<Order>
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a product successfully", async () => {
    const mockProduct = {
      id: "1",
      name: "Sample Product",
      orders: [],
      destroy: jest.fn(),
    };
    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(mockProduct);
    (mockOrderModel.findAll as jest.Mock).mockResolvedValue([]);

    const result = await productService.delete("1");

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith("1", {
      include: [{ model: Order, as: "orders" }],
    });

    expect(mockProduct.destroy).toHaveBeenCalledTimes(1);

    expect(result.status).toBe(204);
    expect(result.message).toBe("");
  });

  it("should handle 'Product not found'", async () => {
    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await productService.delete("1");

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith("1", {
      include: [{ model: Order, as: "orders" }],
    });

    expect(result.status).toBe(404);
    expect(result.message).toBe("Product not found");
  });

  it("should handle 'Product already in use'", async () => {
    const mockProduct = {
      id: "1",
      name: "Sample Product",
      orders: [{ id: 1 /* other fields */ }],
    };
    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    const result = await productService.delete("1");

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith("1", {
      include: [{ model: Order, as: "orders" }],
    });

    expect(result.status).toBe(400);
    expect(result.message).toBe("Product already in use");
  });
});
