import CategoryService from "../category.service";
import Category from "../../../database/models/Category";
import { ModelStatic } from "sequelize";
import createCategoryValidation from "../validations/createCategory";
import { resp } from "../../../utils/resp";

jest.mock("../../../database/models/Category", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("CategoryService - create", () => {
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

  it("should create a new category", async () => {
    const categoryName = "New Category";

    (mockCategoryModel.findOne as jest.Mock).mockResolvedValue(null);
    (mockCategoryModel.create as jest.Mock).mockResolvedValue({});

    const result = await categoryService.create(categoryName);

    expect(mockCategoryModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
      where: { name: categoryName },
    });

    expect(mockCategoryModel.create).toHaveBeenCalledTimes(1);
    expect(mockCategoryModel.create).toHaveBeenCalledWith({
      name: categoryName,
    });

    expect(result.status).toBe(201);
    expect(result.message).toBe("Created");
  });

  it("should handle validation errors when creating a category", async () => {
    const categoryName = "Ne";

    const result = await categoryService.create(categoryName);

    expect(result.status).toBe(400);
    expect(result.message).toBe(
      `"name" length must be at least 3 characters long`
    );
  });

  it("should handle 'Category with this name already exists' when creating a category", async () => {
    const categoryName = "Existing Category";

    const mockExistingCategory = { id: 1, name: categoryName };
    (mockCategoryModel.findOne as jest.Mock).mockResolvedValue(
      mockExistingCategory
    );

    const result = await categoryService.create(categoryName);

    expect(result.status).toBe(400);
    expect(result.message).toBe("Category with this name already exists");
  });
});
