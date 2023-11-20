import CategoryService from "../category.service";
import Category from "../../../database/models/Category";
import { ModelStatic } from "sequelize";
import updateCategoryValidation from "../validations/updateCategory";
import { resp } from "../../../utils/resp";

jest.mock("../../../database/models/Category", () => ({
  findByPk: jest.fn(),
  findOne: jest.fn(),
}));

describe("CategoryService - update", () => {
  let categoryService: CategoryService;
  let mockCategoryModel: jest.Mocked<ModelStatic<Category>>;

  beforeEach(() => {
    categoryService = new CategoryService();
    mockCategoryModel =
      require("../../../database/models/Category") as jest.Mocked<
        ModelStatic<Category>
      >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a category", async () => {
    const categoryId = 1;
    const updatedName = "Updated Category";

    const mockCategory = {
      id: categoryId,
      name: "Old Category",
      update: jest.fn(),
    };
    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue(mockCategory);
    (mockCategoryModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await categoryService.update(categoryId, updatedName);

    expect(mockCategoryModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(categoryId);

    expect(mockCategoryModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
      where: { name: updatedName },
    });

    expect(mockCategory.update).toHaveBeenCalledTimes(1);
    expect(mockCategory.update).toHaveBeenCalledWith({ name: updatedName });

    expect(result.status).toBe(203);
    expect(result.message).toBe("");
  });

  it("should handle validation errors when updating a category", async () => {
    const categoryId = 1;
    const updatedName = "Up";

    const result = await categoryService.update(categoryId, updatedName);

    expect(result.status).toBe(400);
    expect(result.message).toBe(
      `"name" length must be at least 3 characters long`
    );
  });

  it("should handle 'Category not found' when updating a category", async () => {
    const categoryId = 1;
    const updatedName = "Updated Category";

    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await categoryService.update(categoryId, updatedName);

    expect(result.status).toBe(404);
    expect(result.message).toBe("Category not found");
  });

  it("should handle 'Category with this name already exists' when updating a category", async () => {
    const categoryId = 1;
    const updatedName = "Existing Category";

    const mockExistingCategory = { id: 2, name: updatedName };
    (mockCategoryModel.findByPk as jest.Mock).mockResolvedValue({
      id: categoryId,
      name: "Old Category",
    });
    (mockCategoryModel.findOne as jest.Mock).mockResolvedValue(
      mockExistingCategory
    );

    const result = await categoryService.update(categoryId, updatedName);

    expect(result.status).toBe(400);
    expect(result.message).toBe("Category with this name already exists");
  });
});
