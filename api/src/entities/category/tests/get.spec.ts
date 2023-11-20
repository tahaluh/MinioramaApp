import CategoryService from "../category.service";
import Category from "../../../database/models/Category";
import { ModelStatic } from "sequelize";
import { resp } from "../../../utils/resp";

jest.mock("../../../database/models/Category", () => ({
  findAll: jest.fn(),
}));

describe("CategoryService - get", () => {
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

  it("should return all categories", async () => {
    const mockCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];

    (mockCategoryModel.findAll as jest.Mock).mockResolvedValue(mockCategories);

    const result = await categoryService.get();

    expect(mockCategoryModel.findAll).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(201);
    expect(result.message).toEqual(mockCategories);
  });
});
