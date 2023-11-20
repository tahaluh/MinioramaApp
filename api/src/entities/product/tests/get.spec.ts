import { ModelStatic } from "sequelize";
import ProductService from "../product.service";
import Category from "../../../database/models/Category";
import Product from "../../../database/models/Product";

jest.mock("../../../database/models/Product", () => ({
  findAll: jest.fn(),
  belongsToMany: jest.fn(),
}));
jest.mock("../../../database/models/Category", () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
}));
jest.mock("../../../database/models/User", () => ({
  belongsToMany: jest.fn(),
}));
jest.mock("../../../database/models/Wishlist", () => ({
  belongsTo: jest.fn(),
}));

describe("ProductService - get", () => {
  let productService: ProductService;
  let mockProductModel: ModelStatic<Product>;
  let mockCategoryModel: ModelStatic<Category>;

  beforeEach(() => {
    productService = new ProductService();
    mockProductModel =
      require("../../../database/models/Product") as ModelStatic<Product>;
    mockCategoryModel =
      require("../../../database/models/Category") as ModelStatic<Category>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all products with categories", async () => {
    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];
    const mockProducts = [
      {
        id: 1,
        name: "Product 1",
        price: 10,
        description: "Description 1",
        imageUrl: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: mockCategories,
      },
      { id: 2, name: "Product 2" },
    ];

    (mockProductModel.findAll as jest.Mock).mockResolvedValue(mockProducts);
    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue(
      mockCategories[0]
    );

    const result = await productService.get();

    expect(mockProductModel.findAll).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: mockCategoryModel,
          as: "categories",
          where: {},
        },
      ],
      limit: 25,
      offset: 0,
      where: {},
    });

    expect(result.message).toEqual(mockProducts);
  });
});
