import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
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
