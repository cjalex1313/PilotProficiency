/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Param, Patch, Request } from '@nestjs/common';
import { TrackedSkillsService } from './tracked-skills.service';
import { SkillService } from '../skill.service';
import { mapPracticeLogToDto, mapSkillToDto } from '../../helpers';
import { SkillFullDto } from '../dtos/skill.dto';
import { PracticeLogsService } from '../practice-logs/practice-logs.service';

@Controller('tracked-skills')
export class TrackedSkillController {
  constructor(
    private trackedSkillsService: TrackedSkillsService,
    private skillsService: SkillService,
    private practiceLogsService: PracticeLogsService,
  ) {}

  @Get('')
  async getUserTrackedSkills(@Request() req) {
    const userId: string = req?.user?.sub;
    const trackedSkills =
      await this.trackedSkillsService.getUserTrackedSkills(userId);
    return trackedSkills.map((ts) => ts.skillId.toString());
  }

  @Get('full')
  async getUserTrackedSkillsFull(@Request() req) {
    const userId: string = req?.user?.sub;
    const trackedSkills =
      await this.trackedSkillsService.getUserTrackedSkills(userId);
    const skillIds = trackedSkills.map((s) => s.skillId.toString());
    const skills = await this.skillsService.getSkillsByIds(skillIds);
    const latestPracticeLogs =
      await this.practiceLogsService.getLatestPracticeLogForSkills(
        userId,
        skillIds,
      );
    let response: SkillFullDto[] = [];
    if (skills) {
      response = skills.map((s) => {
        const skillDto = mapSkillToDto(s);
        const latestPracticeLog = latestPracticeLogs.find((pl) =>
          pl.skillId.equals(s._id),
        );
        return {
          ...skillDto,
          latestPracticeLog: latestPracticeLog
            ? mapPracticeLogToDto(latestPracticeLog)
            : null,
        };
      });
    }
    return response;
  }

  @Patch('track/:skillId')
  async trackSkill(@Request() req, @Param('skillId') skillId: string) {
    const userId: string = req?.user?.sub;
    await this.trackedSkillsService.userTrackSkill(userId, skillId);
  }

  @Patch('untrack/:skillId')
  async untrackSkill(@Request() req, @Param('skillId') skillId: string) {
    const userId: string = req?.user?.sub;
    await this.trackedSkillsService.userUntrackSkill(userId, skillId);
  }
}
