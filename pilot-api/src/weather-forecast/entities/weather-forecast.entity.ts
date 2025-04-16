import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherForecastDocument = HydratedDocument<WeatherForecast>;

@Schema()
export class WeatherForecast {
  @Prop({ required: true })
  location: string;
  @Prop()
  temperature: number;
}

export const WeatherForecastSchema =
  SchemaFactory.createForClass(WeatherForecast);
