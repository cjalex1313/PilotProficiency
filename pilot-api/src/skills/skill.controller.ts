import { Body, Controller, Get, Post } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { SkillCreateDto } from './dtos/skill-create.dto';
import { SkillDto } from './dtos/skill.dto';
import { Skill } from './entities/skill.entity';

@Controller('skill')
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Get('')
  async getSkills() {
    const skills = await this.skillService.getSkills();
    const responseSkills = skills.map((s) => this.mapSkillToDto(s));
    return responseSkills;
  }

  @Post('')
  @Roles(Role.Admin)
  async createSkill(@Body() createSkillDto: SkillCreateDto) {
    const createdSkill = await this.skillService.createSkill(createSkillDto);
    return this.mapSkillToDto(createdSkill);
  }

  private mapSkillToDto(skill: Skill): SkillDto {
    return {
      id: skill._id.toString(),
      name: skill.name,
      description: skill.description,
      instructions: skill.instructions,
      categoryId: skill.categoryId,
      relatedSkillIds: skill.relatedSkillIds,
    };
  }
}
