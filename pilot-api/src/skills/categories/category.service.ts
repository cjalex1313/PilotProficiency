import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../entities/category.entity';
import { Model } from 'mongoose';
import { CategoryCreateDto } from '../dtos/category/category-create.dto';
import { CategoryDto } from '../dtos/category/category.dto';
import {
  CategoryDeleteHasSkillException,
  CategoryNameExistsException,
  CategoryNotFoundException,
} from 'src/shared/exceptions';
import { CategoryUpdateDto } from '../dtos/category/category-update.dto';
import { Skill } from '../entities/skill.entity';
import { mapCategoryToDto } from '../helpers';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private cateogryModel: Model<Category>,
    @InjectModel(Skill.name) private skillModel: Model<Skill>,
  ) {}

  async getCategories() {
    const categories = await this.cateogryModel.find();
    return categories.map((c) => mapCategoryToDto(c));
  }

  async getCategory(id: string) {
    const category = await this.cateogryModel.findById(id);
    if (category == null) {
      throw new CategoryNotFoundException(id);
    }
    return mapCategoryToDto(category);
  }

  async deleteCategory(id: string) {
    const category = await this.cateogryModel.findById(id);
    if (category == null) {
      throw new CategoryNotFoundException(id);
    }
    const skillCount = await this.skillModel.countDocuments({ categoryId: id });
    if (skillCount > 0) {
      throw new CategoryDeleteHasSkillException(category.name, skillCount);
    }
    await category.deleteOne();
  }

  async updateCategory(categoryUpdateDto: CategoryUpdateDto) {
    const dbCategory = await this.cateogryModel.findById(categoryUpdateDto.id);
    if (dbCategory == null) {
      throw new CategoryNotFoundException(categoryUpdateDto.id);
    }
    dbCategory.name = categoryUpdateDto.name;
    dbCategory.description = categoryUpdateDto.description;
    await dbCategory.save();
    const resultDto = mapCategoryToDto(dbCategory);
    return resultDto;
  }

  async addNewCategory(
    createCategoryDto: CategoryCreateDto,
  ): Promise<CategoryDto> {
    const existingCategory = await this.cateogryModel.findOne({
      name: createCategoryDto.name,
    });
    if (existingCategory) {
      throw new CategoryNameExistsException(createCategoryDto.name);
    }
    const createdCategory = await this.cateogryModel.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });
    return mapCategoryToDto(createdCategory);
  }
}
