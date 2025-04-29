import mongoose, { Types } from 'mongoose';
import { Skill } from '../../skills/entities/skill.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ProficiencyLevel {
  NEEDS_IMPROVEMENT = 0,
  SATISFACTORY = 1,
  GOOD = 2,
  EXCELLENT = 3,
}

@Schema({ timestamps: true })
export class PracticeLog {
  _id: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
    index: true,
  })
  skillId: Types.ObjectId;
  skill?: Skill;
  @Prop({
    required: true,
  })
  practiceDate: Date;
  @Prop({
    required: true,
    type: Number, // Store as a Number in MongoDB
    enum: Object.values(ProficiencyLevel).filter((v) => typeof v === 'number'), // Use numeric enum values for validation
  })
  proficiency: ProficiencyLevel;
  @Prop({})
  notes?: string;
}

export const PracticeLogSchema = SchemaFactory.createForClass(PracticeLog);

PracticeLogSchema.index({ userId: 1, skillId: 1 });

PracticeLogSchema.virtual('skill', {
  ref: 'Skill',
  localField: 'skillId',
  foreignField: '_id',
  justOne: true,
});
