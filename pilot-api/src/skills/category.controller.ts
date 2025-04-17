import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dtos/category-create.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  async getCategories() {
    const categories = await this.categoryService.getCategories();
    return categories;
  }

  @Post('')
  @Roles(Role.Admin)
  async createCategory(@Body() createCategoryDto: CategoryCreateDto) {
    const category =
      await this.categoryService.addNewCategory(createCategoryDto);
    return category;
  }
}
