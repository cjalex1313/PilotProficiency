import { Types } from 'mongoose';
import { Skill } from './skill.entity';

export class PracticeLog {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  skillId: Types.ObjectId;
  skill?: Skill;
  practiceDate: Date;
  proficiency: number;
  notes: string;
}
