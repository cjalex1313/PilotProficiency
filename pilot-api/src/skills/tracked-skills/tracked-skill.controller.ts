/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Param, Patch, Request } from '@nestjs/common';
import { TrackedSkillsService } from './tracked-skills.service';
import { SkillService } from '../skill.service';
import { mapSkillToDto } from '../helpers';
import { SkillDto } from '../dtos/skill.dto';

@Controller('tracked-skills')
export class TrackedSkillController {
  constructor(
    private trackedSkillsService: TrackedSkillsService,
    private skillsService: SkillService,
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
    let response: SkillDto[] = [];
    if (skills) {
      response = skills.map((s) => mapSkillToDto(s));
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
