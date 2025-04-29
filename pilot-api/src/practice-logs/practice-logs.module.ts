import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PracticeLog,
  PracticeLogSchema,
} from 'src/practice-logs/entities/practice-log.entity';
import { SkillsModule } from 'src/skills/skills.module';
import { PracticeLogsService } from './practice-logs.service';
import { PracticeLogsController } from './practice-logs.controller';

@Module({
  providers: [PracticeLogsService],
  controllers: [PracticeLogsController],
  imports: [
    MongooseModule.forFeature([
      { name: PracticeLog.name, schema: PracticeLogSchema },
    ]),
    SkillsModule,
  ],
})
export class PracticeLogsModule {}
