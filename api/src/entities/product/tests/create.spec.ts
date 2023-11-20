import ProductService from "../product.service";
import Category from "../../../database/models/Category";
import Product from "../../../database/models/Product";
import CreateProductDTO from "../dto/createProductDTO";
import { ModelStatic } from "sequelize";
import ProductCategory from "../../../database/models/ProductCategory";

jest.mock("../../../database/models/Product", () => ({
  create: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Category", () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/ProductCategory", () => ({
  bulkCreate: jest.fn(),
}));

jest.mock("../../../database/models/User", () => ({
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Wishlist", () => ({
  belongsTo: jest.fn(),
}));

describe("ProductService - create", () => {
  let productService: ProductService;
  let mockProductModel: jest.Mocked<ModelStatic<Product>>;
  let mockCategoryModel: jest.Mocked<ModelStatic<Category>>;
  let mockProductCategoryModel: jest.Mocked<ModelStatic<ProductCategory>>;

  beforeEach(() => {
    productService = new ProductService();
    mockProductModel =
      require("../../../database/models/Product") as jest.Mocked<
        ModelStatic<Product>
      >;
    mockCategoryModel =
      require("../../../database/models/Category") as jest.Mocked<
        ModelStatic<Category>
      >;
    mockProductCategoryModel =
      require("../../../database/models/ProductCategory") as jest.Mocked<
        ModelStatic<ProductCategory>
      >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a product with categories", async () => {
    const createProductDTO: CreateProductDTO = {
      name: "Product 1",
      description: "Description of Product 1",
      price: 15,
      categories: [1, 2],
    };

    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];

    (mockCategoryModel.findByPk as jest.Mock).mockImplementation((id: number) =>
      Promise.resolve(mockCategories.find((cat) => cat.id === id))
    );

    const mockCreatedProduct = { id: 1, ...createProductDTO };
    (mockProductModel.create as jest.Mock).mockResolvedValue(
      mockCreatedProduct
    );

    (mockProductCategoryModel.bulkCreate as jest.Mock).mockImplementation(
      (data: any) => Promise.resolve(data)
    );

    const result = await productService.create(createProductDTO);

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(2);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(1);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(2);

    expect(mockProductModel.create).toHaveBeenCalledTimes(1);
    expect(mockProductModel.create).toHaveBeenCalledWith(createProductDTO);

    expect(mockProductCategoryModel.bulkCreate).toHaveBeenCalledTimes(1);
    expect(mockProductCategoryModel.bulkCreate).toHaveBeenCalledWith(
      createProductDTO.categories!.map((id) => ({
        productId: mockCreatedProduct.id,
        categoryId: id,
      }))
    );

    expect(result.status).toBe(201);
    expect(result.message).toBe("");
  });

  it("should handle validation errors when creating a product", async () => {
    const createProductDTO: CreateProductDTO = {
      name: "Pr",
      description: "Description of Product 2",
      price: 20,
      categories: [1, 2],
    };

    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await productService.create(createProductDTO);

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(0);
    expect(mockProductModel.create).toHaveBeenCalledTimes(0);

    expect(result.status).toBe(400);
    expect(result.message).toBe(
      `"name" length must be at least 3 characters long`
    );
  });

  it("should handle 'Category not found' when creating a product", async () => {
    const createProductDTO: CreateProductDTO = {
      name: "Product 3",
      description: "Description of Product 3",
      price: 25,
      categories: [1, 2],
    };

    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue(undefined);

    const result = await productService.create(createProductDTO);

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(2);
    expect(mockProductModel.create).toHaveBeenCalledTimes(0);

    expect(result.status).toBe(404);
    expect(result.message).toBe("Category not found");
  });
});
