import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getModelToken } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import {
  CategoryNameExistsException,
  CategoryNotFoundException,
} from 'src/shared/exceptions';
import { CategoryDto } from './dtos/category.dto';

const mockCategoryModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getCategories should retrieve a list of categories', async () => {
    // arrange
    mockCategoryModel.find.mockReturnValue([
      {
        id: '1',
        name: 'Cat 1',
        description: null,
      },
      {
        id: '2',
        name: 'Cat 2',
        description: 'Desc 2',
      },
    ]);

    // act
    const cateogires = await service.getCategories();

    // assert
    expect(cateogires).toBeTruthy();
    expect(cateogires.length).toBe(2);
    expect(cateogires).toContainEqual({
      id: '1',
      name: 'Cat 1',
      description: null,
    });
    expect(cateogires).toContainEqual({
      id: '2',
      name: 'Cat 2',
      description: 'Desc 2',
    });
    expect(cateogires.every((i) => i instanceof CategoryDto)).toBe(true);
  });

  it('getCategory should throw a CategoryNotFoundException if it does not exist', async () => {
    mockCategoryModel.findById.mockReturnValue(null);

    try {
      await service.getCategory('');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(CategoryNotFoundException);
    }
  });

  it('getCategory should return the cateogry from the db', async () => {
    mockCategoryModel.findById.mockReturnValue({
      id: '1',
      name: 'Cat 1',
    });

    const categoryDto = await service.getCategory('1');

    expect(categoryDto).toBeTruthy();
    expect(categoryDto.id).toBe('1');
    expect(categoryDto.name).toBe('Cat 1');
  });

  it('deleteCategory should throw CategoryNotFoundException if category does not exist', async () => {
    mockCategoryModel.findById.mockReturnValue(null);

    try {
      await service.deleteCategory('');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(CategoryNotFoundException);
    }
  });

  it('deleteCategory should call deleteOne on the category entity', async () => {
    const cateogryToRetrieveFromDb = {
      deleteOne: jest.fn(),
    };
    mockCategoryModel.findById.mockReturnValue(cateogryToRetrieveFromDb);

    await service.deleteCategory('');

    expect(cateogryToRetrieveFromDb.deleteOne).toHaveBeenCalled();
  });

  it('updateCategory should throw CategoryNotFoundException if cateogry does not exist', async () => {
    mockCategoryModel.findById.mockReturnValue(null);

    try {
      await service.updateCategory({
        id: '1',
        name: '',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(CategoryNotFoundException);
    }
  });

  it('updateCategory should save the entity and return the dtof or it', async () => {
    const cateogryToUpdate = {
      id: '1',
      name: 'Updated name',
      description: null,
    };
    const dbEntity = {
      id: '1',
      name: 'Old name',
      description: 'desc',
      save: jest.fn(),
    };
    mockCategoryModel.findById.mockReturnValue(dbEntity);

    const updatedDto = await service.updateCategory(cateogryToUpdate);

    expect(updatedDto).toBeTruthy();
    expect(dbEntity.save).toHaveBeenCalled();
    expect(updatedDto.name).toBe(cateogryToUpdate.name);
    expect(updatedDto.description).toBe(cateogryToUpdate.description);
  });

  it('addNewCategory should throw CategoryNameExistsException if cateogry does not exist', async () => {
    mockCategoryModel.findOne.mockReturnValue({
      id: '',
      name: '',
    });

    try {
      await service.addNewCategory({
        name: '',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(CategoryNameExistsException);
    }
  });

  it('addNewCategory should call create on the model and return the cateogry', async () => {
    mockCategoryModel.findOne.mockReturnValue(null);
    mockCategoryModel.create.mockReturnValue({
      id: '1',
      name: 'name',
      description: 'desc',
    });

    const dto = await service.addNewCategory({
      name: 'name',
      description: 'desc',
    });

    expect(dto).toBeTruthy();
    expect(mockCategoryModel.create).toHaveBeenCalled();
    expect(dto).toEqual({
      id: '1',
      name: 'name',
      description: 'desc',
    });
  });
});
