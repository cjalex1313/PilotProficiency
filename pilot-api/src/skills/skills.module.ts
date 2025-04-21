import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Skill, SkillSchema } from './entities/skill.entity';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';

@Module({
  providers: [CategoryService, SkillService],
  controllers: [CategoryController, SkillController],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Skill.name, schema: SkillSchema },
    ]),
  ],
})
export class SkillsModule {}
