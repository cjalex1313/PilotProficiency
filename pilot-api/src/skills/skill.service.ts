import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Skill } from './entities/skill.entity';
import { Model } from 'mongoose';
import { SkillCreateDto } from './dtos/skill-create.dto';
import { SkillUpdateDto } from './dtos/skill-update.dto';
import { SkillNotFoundExpcetion } from 'src/shared/exceptions';

@Injectable()
export class SkillService {
  constructor(@InjectModel(Skill.name) private skillModel: Model<Skill>) {}

  async getSkills() {
    const skills = await this.skillModel.find();
    return skills;
  }

  async getSkill(id: string) {
    const skill = await this.skillModel
      .findById(id)
      .populate(['category', 'relatedSkills']);
    if (skill == null) {
      throw new SkillNotFoundExpcetion(id);
    }
    return skill;
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

  async deleteSkill(id: string) {
    const deletedSkill = await this.skillModel.findByIdAndDelete(id);
    if (deletedSkill == null) {
      throw new SkillNotFoundExpcetion(id);
    }
  }

  async updateSkill(skillDto: SkillUpdateDto) {
    const updatedSkill = await this.skillModel.findByIdAndUpdate(
      skillDto.id,
      skillDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (updatedSkill == null) {
      throw new SkillNotFoundExpcetion(skillDto.id);
    }
    return updatedSkill;
  }
}
