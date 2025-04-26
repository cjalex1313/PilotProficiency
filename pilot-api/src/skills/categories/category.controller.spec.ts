import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { CategoryCreateDto } from '../dtos/category/category-create.dto';
import { CategoryUpdateDto } from '../dtos/category/category-update.dto';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

type MockCategoryService = {
  [K in keyof CategoryService]: jest.Mock;
};

const categoryServiceMockFactory: () => MockCategoryService = jest.fn(() => ({
  getCategories: jest.fn(),
  getCategory: jest.fn(),
  deleteCategory: jest.fn(),
  updateCategory: jest.fn(),
  addNewCategory: jest.fn(),
}));

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: MockCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useFactory: categoryServiceMockFactory,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();
    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get(CategoryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getCategories to call getCategories on service', async () => {
    await controller.getCategories();

    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('getCategory to call getCategory on service', async () => {
    await controller.getCategory('1');

    expect(categoryService.getCategory).toHaveBeenCalled();
  });

  it('createCategory to call addNewCategory on service', async () => {
    const dto: CategoryCreateDto = {
      name: '',
      description: null,
    };
    await controller.createCategory(dto);

    expect(categoryService.addNewCategory).toHaveBeenCalled();
  });

  it('updateCategory to call updateCategory on service', async () => {
    const dto: CategoryUpdateDto = {
      id: '1',
      name: '',
      description: null,
    };
    await controller.updateCategory(dto);

    expect(categoryService.updateCategory).toHaveBeenCalled();
  });

  it('deleteCateogry to call deleteCateogry on service', async () => {
    await controller.deleteCateogry('1');

    expect(categoryService.deleteCategory).toHaveBeenCalled();
  });
});
