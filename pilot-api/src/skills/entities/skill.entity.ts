import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from './category.entity';
import mongoose, { HydratedDocument } from 'mongoose';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({ timestamps: true })
export class Skill {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;
  @Prop({
    type: String,
    default: null,
    required: false,
    trim: true,
  })
  description?: string | null;

  @Prop({
    type: String,
    default: null,
    required: false,
    trim: true,
  })
  instructions?: string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  })
  category: Category;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    default: [],
    required: false,
  })
  relatedSkills?: Skill[];
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
