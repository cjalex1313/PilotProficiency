import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { CategoryService } from './categories/category.service';
import { CategoryController } from './categories/category.controller';
import { Skill, SkillSchema } from './entities/skill.entity';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import {
  UserTrackedSkill,
  UserTrackedSkillSchema,
} from './entities/userTrackedSkill.entity';
import { TrackedSkillController } from './tracked-skills/tracked-skill.controller';
import { TrackedSkillsService } from './tracked-skills/tracked-skills.service';

@Module({
  providers: [CategoryService, SkillService, TrackedSkillsService],
  controllers: [CategoryController, SkillController, TrackedSkillController],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Skill.name, schema: SkillSchema },
      { name: UserTrackedSkill.name, schema: UserTrackedSkillSchema },
    ]),
  ],
})
export class SkillsModule {}
