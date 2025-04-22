import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { SkillCreateDto } from './dtos/skill-create.dto';
import { SkillDto } from './dtos/skill.dto';
import { Skill } from './entities/skill.entity';
import { SkillUpdateDto } from './dtos/skill-update.dto';

@Controller('skill')
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Get('')
  async getSkills() {
    const skills = await this.skillService.getSkills();
    const responseSkills = skills.map((s) => this.mapSkillToDto(s));
    return responseSkills;
  }

  @Get(':id')
  async getSkill(@Param('id') id: string) {
    const skill = await this.skillService.getSkill(id);
    const response = this.mapSkillToDto(skill);
    return response;
  }

  @Post('')
  @Roles(Role.Admin)
  async createSkill(@Body() createSkillDto: SkillCreateDto) {
    const createdSkill = await this.skillService.createSkill(createSkillDto);
    return this.mapSkillToDto(createdSkill);
  }

  @Put('')
  @Roles(Role.Admin)
  async updateSkill(@Body() updateSkillDto: SkillUpdateDto) {
    const newSkill = await this.skillService.updateSkill(updateSkillDto);
    const response = this.mapSkillToDto(newSkill);
    return response;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteSkill(@Param('id') id: string) {
    await this.skillService.deleteSkill(id);
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
