import CategoryService from "../category.service";
import Category from "../../../database/models/Category";
import { ModelStatic } from "sequelize";
import { resp } from "../../../utils/resp";
import Product from "../../../database/models/Product";

jest.mock("../../../database/models/Category", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../../database/models/Product", () => ({
  findAll: jest.fn(),
}));

describe("CategoryService - delete", () => {
  let categoryService: CategoryService;
  let mockCategoryModel: jest.Mocked<ModelStatic<Category>>;
  let mockProductModel: jest.Mocked<ModelStatic<Product>>;

  beforeEach(() => {
    categoryService = new CategoryService();
    mockCategoryModel =
      require("../../../database/models/Category") as jest.Mocked<
        ModelStatic<Category>
      >;
    mockProductModel =
      require("../../../database/models/Product") as jest.Mocked<
        ModelStatic<Product>
      >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a category without associated products", async () => {
    const categoryId = 1;

    const mockCategory = { id: categoryId, products: [], destroy: jest.fn() };

    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue(mockCategory);

    const result = await categoryService.delete(categoryId);

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(categoryId, {
      include: [{ model: Product, as: "products" }],
    });

    expect(mockProductModel.findAll).toHaveBeenCalledTimes(0);

    expect(mockCategory.destroy).toHaveBeenCalledTimes(1);

    expect(result.status).toBe(203);
    expect(result.message).toBe("");
  });

  it("should handle 'Category not found' when deleting a category", async () => {
    const categoryId = 1;

    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await categoryService.delete(categoryId);

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(categoryId, {
      include: [{ model: Product, as: "products" }],
    });

    expect(result.status).toBe(404);
    expect(result.message).toBe("Category not found");
  });

  it("should handle 'Category already in use' when deleting a category", async () => {
    const categoryId = 1;
    const mockCategory = { id: categoryId, products: [{}] };

    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue(mockCategory);

    const result = await categoryService.delete(categoryId);

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(categoryId, {
      include: [{ model: Product, as: "products" }],
    });

    expect(result.status).toBe(404);
    expect(result.message).toBe("Category already in use");
  });
});
