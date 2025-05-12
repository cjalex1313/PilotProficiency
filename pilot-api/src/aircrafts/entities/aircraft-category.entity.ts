import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AircraftCategoryDocument = HydratedDocument<AircraftCategory>;

@Schema()
export class AircraftCategory {
  _id: Types.ObjectId;
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
}

export const AircraftCategorySchema =
  SchemaFactory.createForClass(AircraftCategory);
