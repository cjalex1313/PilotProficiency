import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Skill } from './entities/skill.entity';
import { Model } from 'mongoose';
import { SkillCreateDto } from './dtos/skill-create.dto';

@Injectable()
export class SkillService {
  constructor(@InjectModel(Skill.name) private skillModel: Model<Skill>) {}

  async getSkills() {
    const skills = await this.skillModel.find();
    return skills;
  }

  async createSkill(skillDto: SkillCreateDto) {
    const skillEntity = await this.skillModel.create({
      name: skillDto.name,
      description: skillDto.description,
      instructions: skillDto.instructions,
      categoryId: skillDto.categoryId,
      relatedSkillIds: skillDto.relatedSkillIds,
    });
    return skillEntity;
  }
}
