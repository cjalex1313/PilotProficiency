import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from './category.entity';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({ timestamps: true })
export class Skill {
  _id: Types.ObjectId;
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
  categoryId: Types.ObjectId;
  category?: Category;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    default: [],
    required: false,
  })
  relatedSkillIds?: Types.ObjectId[];
  relatedSkills: Skill[];
}

export const SkillSchema = SchemaFactory.createForClass(Skill);

SkillSchema.virtual('category', {
  ref: 'Category', // The model to use for population
  localField: 'categoryId', // The field in the Skill document (DB) holding the ID
  foreignField: '_id', // The field in the Category document (DB) to match against
  justOne: true, // Expect a single Category document
});

SkillSchema.virtual('relatedSkills', {
  ref: 'Skill', // The model to use
  localField: 'relatedSkillIds', // Field in Skill holding the array of IDs
  foreignField: '_id', // Field in Skill to match against
  justOne: false, // Expect multiple Skill documents
});
