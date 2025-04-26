import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type UserTrackedSkillDocument = HydratedDocument<UserTrackedSkill>;

@Schema({ timestamps: true })
export class UserTrackedSkill {
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
}

export const UserTrackedSkillSchema =
  SchemaFactory.createForClass(UserTrackedSkill);

UserTrackedSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });
