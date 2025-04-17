import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
})
export class SkillsModule {}
