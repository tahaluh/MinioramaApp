import ProductService from "../product.service";
import Category from "../../../database/models/Category";
import Product from "../../../database/models/Product";
import UpdateProductDTO from "../dto/updateProductDTO";
import { ModelStatic } from "sequelize";
import ProductCategory from "../../../database/models/ProductCategory";

jest.mock("../../../database/models/Product", () => ({
  findByPk: jest.fn(),
  update: jest.fn(),
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Category", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../../database/models/ProductCategory", () => ({
  destroy: jest.fn(),
  bulkCreate: jest.fn(),
}));

jest.mock("../../../database/models/User", () => ({
  belongsToMany: jest.fn(),
}));

jest.mock("../../../database/models/Wishlist", () => ({
  belongsTo: jest.fn(),
}));

describe("ProductService - update", () => {
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

  it("should update a product with categories", async () => {
    const updateProductDTO: UpdateProductDTO = {
      name: "Updated Product",
      description: "Updated description",
      price: 25,
      categories: [1, 2],
    };
    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];

    const mockProduct = {
      id: 1,
      ...updateProductDTO,
      categories: mockCategories,
      update: jest.fn().mockResolvedValue({}),
    };
    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    (mockCategoryModel.findByPk as jest.Mock).mockImplementation((id: number) =>
      Promise.resolve(mockCategories.find((cat) => cat.id === id))
    );

    (mockProductCategoryModel.bulkCreate as jest.Mock).mockImplementation(
      (data: any) => Promise.resolve(data)
    );

    const result = await productService.update(updateProductDTO, "1");

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith("1");

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(2);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(1);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(2);

    expect(mockProduct.update).toHaveBeenCalledTimes(1);
    expect(mockProduct.update).toHaveBeenCalledWith(updateProductDTO);

    expect(mockProductCategoryModel.destroy).toHaveBeenCalledTimes(1);
    expect(mockProductCategoryModel.destroy).toHaveBeenCalledWith({
      where: { productId: "1" },
    });

    expect(mockProductCategoryModel.bulkCreate).toHaveBeenCalledTimes(1);
    expect(mockProductCategoryModel.bulkCreate).toHaveBeenCalledWith(
      updateProductDTO.categories!.map((id) => ({
        productId: "1",
        categoryId: id,
      }))
    );

    expect(result.status).toBe(200);
    expect(result.message).toBe(mockProduct);
  });

  it("should handle validation errors when updating a product", async () => {
    const updateProductDTO: UpdateProductDTO = {
      name: "",
      description: "Updated description",
      price: 25,
      categories: [1, 2],
    };

    const result = await productService.update(updateProductDTO, "1");

    expect(result.status).toBe(400);
    expect(result.message).toBe(`"name" is not allowed to be empty`);
    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(0);

    expect(mockProductModel.update).not.toHaveBeenCalled();
  });

  it("should handle 'Product not found' when updating a product", async () => {
    const updateProductDTO: UpdateProductDTO = {
      name: "Updated Product",
      description: "Updated description",
      price: 25,
      categories: [1, 2],
    };

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await productService.update(updateProductDTO, "1");

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith("1");

    expect(result.status).toBe(404);
    expect(result.message).toBe("Product not found");

    expect(mockProductModel.update).not.toHaveBeenCalled();
  });

  it("should handle 'Category not found' when updating a product", async () => {
    const updateProductDTO: UpdateProductDTO = {
      name: "Updated Product",
      description: "Updated description",
      price: 25,
      categories: [1, 2],
    };

    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];

    const mockProduct = {
      id: "1",
      ...updateProductDTO,
      categories: mockCategories,
      update: jest.fn().mockResolvedValue({}),
    };

    (mockProductModel.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    (mockCategoryModel.findByPk as jest.Mock).mockImplementation((id: number) =>
      Promise.resolve(mockCategories.find((cat) => cat.id === id))
    );

    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

    const result = await productService.update(updateProductDTO, "1");

    expect(mockProductModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockProductModel.findByPk).toHaveBeenCalledWith("1");

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(2);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(1);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(2);

    expect(mockProductModel.update).not.toHaveBeenCalled();

    expect(result.status).toBe(404);
    expect(result.message).toBe("Category not found");
  });
});
