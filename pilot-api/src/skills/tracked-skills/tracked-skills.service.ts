import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Skill } from '../entities/skill.entity';
import { Model } from 'mongoose';
import { SkillNotFoundExpcetion } from 'src/shared/exceptions';
import { UserTrackedSkill } from '../entities/userTrackedSkill.entity';

@Injectable()
export class TrackedSkillsService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<Skill>,
    @InjectModel(UserTrackedSkill.name)
    private userTrackSkillModel: Model<UserTrackedSkill>,
  ) {}

  async userTrackSkill(userId: string, skillId: string) {
    const userTrackedSkill = await this.userTrackSkillModel.findOne({
      userId,
      skillId,
    });
    if (userTrackedSkill == null) {
      const skill = await this.skillModel.findById(skillId);
      if (skill == null) {
        throw new SkillNotFoundExpcetion(skillId);
      }
      await this.userTrackSkillModel.create({
        userId,
        skillId,
      });
    }
  }

  async userUntrackSkill(userId: string, skillId: string) {
    const userTrackedSkill = await this.userTrackSkillModel.findOne({
      userId,
      skillId,
    });
    if (userTrackedSkill != null) {
      await userTrackedSkill.deleteOne();
    }
  }

  async getUserTrackedSkills(userId: string) {
    const userTrackedSkills = await this.userTrackSkillModel.find({
      userId: userId,
    });
    return userTrackedSkills;
  }

  async getUserTrackedSkillsFull(userId: string) {
    const userTrackedSkills = await this.userTrackSkillModel
      .find({
        userId: userId,
      })
      .populate(['skill']);
    return userTrackedSkills;
  }
}
