import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Document, Model, Types } from 'mongoose';
import { CategoryCreateDto } from './dtos/category-create.dto';
import { CategoryDto } from './dtos/category.dto';
import { CategoryNameExistsException } from 'src/shared/exceptions';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private cateogryModel: Model<Category>,
  ) {}

  async getCategories() {
    const categories = await this.cateogryModel.find().exec();
    return categories.map((c) => mapDocumentToDto(c));
  }

  async addNewCategory(
    createCategoryDto: CategoryCreateDto,
  ): Promise<CategoryDto> {
    const existingCategory = await this.cateogryModel
      .findOne({ name: createCategoryDto.name })
      .exec();
    if (existingCategory) {
      throw new CategoryNameExistsException(createCategoryDto.name);
    }
    const createdCategory = await this.cateogryModel.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });
    return mapDocumentToDto(createdCategory);
  }
}
function mapDocumentToDto(
  category: Document<unknown, object, Category> &
    Category & { _id: Types.ObjectId } & { __v: number },
): CategoryDto {
  return {
    id: category.id as string,
    name: category.name,
    description: category.description,
  };
}
