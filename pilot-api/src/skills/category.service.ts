import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Document, Model, Types } from 'mongoose';
import { CategoryCreateDto } from './dtos/category-create.dto';
import { CategoryDto } from './dtos/category.dto';
import {
  CategoryNameExistsException,
  CategoryNotFoundException,
} from 'src/shared/exceptions';
import { CategoryUpdateDto } from './dtos/category-update.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private cateogryModel: Model<Category>,
  ) {}

  async getCategories() {
    const categories = await this.cateogryModel.find();
    return categories.map((c) => this.mapDocumentToDto(c));
  }

  async getCategory(id: string) {
    const category = await this.cateogryModel.findById(id);
    if (category == null) {
      throw new CategoryNotFoundException(id);
    }
    return this.mapDocumentToDto(category);
  }

  async deleteCategory(id: string) {
    const category = await this.cateogryModel.findById(id);
    if (category == null) {
      throw new CategoryNotFoundException(id);
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
    const resultDto = this.mapDocumentToDto(dbCategory);
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
    return this.mapDocumentToDto(createdCategory);
  }

  private mapDocumentToDto(
    category: Document<unknown, object, Category> &
      Category & { _id: Types.ObjectId } & { __v: number },
  ): CategoryDto {
    return new CategoryDto(
      category.id as string,
      category.name,
      category.description,
    );
  }
}
