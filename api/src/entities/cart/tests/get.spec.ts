import Product from "../../../database/models/Product";
import User from "../../../database/models/User";
import CartService from "../cart.service";

jest.mock("../../../database/models/User", () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Product", () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
}));

describe("CartService - get", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return user's cart products", async () => {
    const userId = 1;

    // Simulando um usuário com produtos no carrinho
    const mockUser = {
      id: userId,
      cartProducts: [
        {
          id: 1,
          name: "Product 1",
          description: "Product 1 description",
          price: 10,
          imageUrl: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          Cart: {
            id: 1,
            productId: 1,
            quantity: 1,
            userId: 1,
          },
        },
        {
          id: 2,
          name: "Product 2",
          description: "Product 2 description",
          price: 23,
          imageUrl: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          Cart: {
            id: 2,
            productId: 2,
            quantity: 37,
            userId: 1,
          },
        },
      ],
    };

    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

    const result = await cartService.get(userId);

    expect(User.findByPk).toHaveBeenCalledTimes(1);
    expect(User.findByPk).toHaveBeenCalledWith(userId, {
      include: [{ model: Product, as: "cartProducts" }],
    });

    expect(result.status).toBe(200);
    expect(result.message).toEqual(mockUser.cartProducts);
  });

  it("should return 404 if user is not found", async () => {
    const userId = 1;

    (User.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await cartService.get(userId);

    expect(User.findByPk).toHaveBeenCalledTimes(1);
    expect(User.findByPk).toHaveBeenCalledWith(userId, {
      include: [{ model: Product, as: "cartProducts" }],
    });

    expect(result.status).toBe(404);
    expect(result.message).toBe("User not found");
  });
});
