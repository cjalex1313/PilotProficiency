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
import { PracticeLog, PracticeLogSchema } from './entities/practice-log.entity';
import { PracticeLogsController } from './practice-logs/practice-logs.controller';
import { PracticeLogsService } from './practice-logs/practice-logs.service';
import { SessionsService } from './sessions/sessions.service';
import { Session, SessionSchema } from './entities/session.entity';
import { SessionsController } from './sessions/sessions.controller';

@Module({
  providers: [
    CategoryService,
    SkillService,
    TrackedSkillsService,
    PracticeLogsService,
    SessionsService,
  ],
  controllers: [
    CategoryController,
    SkillController,
    TrackedSkillController,
    PracticeLogsController,
    SessionsController,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Skill.name, schema: SkillSchema },
      { name: UserTrackedSkill.name, schema: UserTrackedSkillSchema },
      { name: PracticeLog.name, schema: PracticeLogSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
})
export class SkillsModule {}
