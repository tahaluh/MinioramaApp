import ProductService from "../product.service";
import Product from "../../../database/models/Product";
import Wishlist from "../../../database/models/Wishlist";
import { ModelStatic } from "sequelize";

jest.mock("../../../database/models/Product", () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Wishlist", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock("../../../database/models/Category", () => ({
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/User", () => ({
  belongsToMany: jest.fn(),
}));

describe("ProductService - wishlist", () => {
  let productService: ProductService;
  let mockProductModel: jest.Mocked<ModelStatic<Product>>;
  let mockWishlistModel: jest.Mocked<ModelStatic<Wishlist>>;

  beforeEach(() => {
    productService = new ProductService();
    mockProductModel =
      require("../../../database/models/Product") as jest.Mocked<
        ModelStatic<Product>
      >;
    mockWishlistModel =
      require("../../../database/models/Wishlist") as jest.Mocked<
        ModelStatic<Wishlist>
      >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add product to wishlist when not present", async () => {
    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({ id: 1 });

    (mockWishlistModel.findOne as jest.Mock).mockResolvedValue(null);
    (mockWishlistModel.create as jest.Mock).mockResolvedValue({});

    const result = await productService.wishlist(1, 1);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);

    expect(mockWishlistModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockWishlistModel.findOne).toHaveBeenCalledWith({
      where: { productId: 1, userId: 1 },
    });

    expect(mockWishlistModel.create).toHaveBeenCalledTimes(1);
    expect(mockWishlistModel.create).toHaveBeenCalledWith({
      productId: 1,
      userId: 1,
    });

    expect(result.status).toBe(201);
    expect(result.message).toBe("");
  });

  it("should remove product from wishlist when already present", async () => {
    (mockProductModel.findByPk as jest.Mock).mockResolvedValue({ id: 1 });

    const mockWishlist = {
      id: 1,
      userId: 1,
      produictId: 1,
      destroy: jest.fn(),
    };
    (mockWishlistModel.findOne as jest.Mock).mockResolvedValue(mockWishlist);

    const result = await productService.wishlist(1, 1);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);

    expect(mockWishlistModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockWishlistModel.findOne).toHaveBeenCalledWith({
      where: { productId: 1, userId: 1 },
    });

    expect(mockWishlist.destroy).toHaveBeenCalledTimes(1);

    expect(result.status).toBe(204);
    expect(result.message).toBe("");
  });

  it("should handle 'Product not found'", async () => {
    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await productService.wishlist(1, 1);

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);

    expect(result.status).toBe(404);
    expect(result.message).toBe("Product not found");
  });
});
