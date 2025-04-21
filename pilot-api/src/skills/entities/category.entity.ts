import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  _id: Types.ObjectId;
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
  @Prop({
    type: String,
    default: null,
    required: false,
  })
  description?: string | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
