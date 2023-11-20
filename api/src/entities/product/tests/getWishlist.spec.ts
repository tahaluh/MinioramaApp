import ProductService from "../product.service";
import User from "../../../database/models/User";
import Product from "../../../database/models/Product";
import Wishlist from "../../../database/models/Wishlist";

jest.mock("../../../database/models/User", () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Product", () => ({
  findAll: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Category", () => ({
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Wishlist", () => ({
  findAll: jest.fn(),
  belongsTo: jest.fn(),
}));

describe("ProductService - getWishlist", () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the wishlist products of a user", async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      products: [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ],
    };

    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    (Wishlist.findAll as jest.Mock).mockResolvedValue(mockUser.products);

    const result = await productService.getWishlist(userId);

    expect(User.findByPk).toHaveBeenCalledTimes(1);
    expect(User.findByPk).toHaveBeenCalledWith(userId);

    expect(Wishlist.findAll).toHaveBeenCalledTimes(1);
    expect(Wishlist.findAll).toHaveBeenCalledWith({
      where: { userId },
      include: [{ model: Product, as: "product", where: {} }],
      limit: 25,
      offset: 0,
    });

    expect(result.status).toBe(200);
    expect(result.message).toEqual(mockUser.products);
  });

  it("should return an error if user is not found", async () => {
    const userId = 1;
    (User.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await productService.getWishlist(userId);

    expect(User.findByPk).toHaveBeenCalledTimes(1);
    expect(User.findByPk).toHaveBeenCalledWith(userId);

    expect(result.status).toBe(404);
    expect(result.message).toBe("User not found");
  });
});
