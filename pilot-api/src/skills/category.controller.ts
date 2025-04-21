import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dtos/category/category-create.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { CategoryUpdateDto } from './dtos/category/category-update.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  async getCategories() {
    const categories = await this.categoryService.getCategories();
    return categories;
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    const category = await this.categoryService.getCategory(id);
    return category;
  }

  @Post('')
  @Roles(Role.Admin)
  async createCategory(@Body() createCategoryDto: CategoryCreateDto) {
    const category =
      await this.categoryService.addNewCategory(createCategoryDto);
    return category;
  }

  @Put('')
  @Roles(Role.Admin)
  async updateCategory(@Body() updateCateogryDto: CategoryUpdateDto) {
    const category =
      await this.categoryService.updateCategory(updateCateogryDto);
    return category;
  }

  @Delete(':id')
  async deleteCateogry(@Param('id') id: string) {
    await this.categoryService.deleteCategory(id);
  }
}
