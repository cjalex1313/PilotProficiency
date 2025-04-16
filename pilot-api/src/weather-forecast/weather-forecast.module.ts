import { Module } from '@nestjs/common';
import { WeatherForecastService } from './weather-forecast.service';
import { WeatherForecastController } from './weather-forecast.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WeatherForecast,
  WeatherForecastSchema,
} from './entities/weather-forecast.entity';

@Module({
  controllers: [WeatherForecastController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: WeatherForecast.name, schema: WeatherForecastSchema },
    ]),
  ],
  providers: [WeatherForecastService],
})
export class WeatherForecastModule {}
