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
import { SkillUpdateDto } from './dtos/skill-update.dto';
import { CategoryService } from './categories/category.service';
import { mapSkillToDto } from '..//helpers';

@Controller('skill')
export class SkillController {
  constructor(
    private skillService: SkillService,
    private cateogryService: CategoryService,
  ) {}

  @Get('')
  async getSkills() {
    const skills = await this.skillService.getSkills();
    const responseSkills = skills.map((s) => mapSkillToDto(s));
    return responseSkills;
  }

  @Get(':id')
  async getSkill(@Param('id') id: string) {
    const skill = await this.skillService.getSkill(id);
    const response = mapSkillToDto(skill);
    return response;
  }

  @Post('')
  @Roles(Role.Admin)
  async createSkill(@Body() createSkillDto: SkillCreateDto) {
    const createdSkill = await this.skillService.createSkill(createSkillDto);
    return mapSkillToDto(createdSkill);
  }

  @Put('')
  @Roles(Role.Admin)
  async updateSkill(@Body() updateSkillDto: SkillUpdateDto) {
    const newSkill = await this.skillService.updateSkill(updateSkillDto);
    const response = mapSkillToDto(newSkill);
    return response;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteSkill(@Param('id') id: string) {
    await this.skillService.deleteSkill(id);
  }
}
