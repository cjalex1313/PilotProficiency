import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { SkillCreateDto } from './dtos/skill-create.dto';
import { SkillDto } from './dtos/skill.dto';
import { Skill } from './entities/skill.entity';
import { SkillUpdateDto } from './dtos/skill-update.dto';
import { CategoryService } from './category.service';

@Controller('skill')
export class SkillController {
  constructor(
    private skillService: SkillService,
    private cateogryService: CategoryService,
  ) {}

  @Get('')
  async getSkills() {
    const skills = await this.skillService.getSkills();
    const responseSkills = skills.map((s) => this.mapSkillToDto(s));
    return responseSkills;
  }

  @Get('tracked-skills')
  async getUserTrackedSkills(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId: string = req?.user?.sub;
    const trackedSkills = await this.skillService.getUserTrackedSkills(userId);
    return trackedSkills;
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
      category: skill.category
        ? this.cateogryService.mapDocumentToDto(skill.category)
        : null,
      relatedSkillIds: skill.relatedSkillIds,
      relatedSkills: skill.relatedSkills
        ? skill.relatedSkills.map((rs) => this.mapSkillToDto(rs))
        : null,
    };
  }
}
