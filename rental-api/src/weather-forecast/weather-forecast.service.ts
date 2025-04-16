import { Injectable } from '@nestjs/common';
import { CreateWeatherForecastDto } from './dto/create-weather-forecast.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WeatherForecast } from './entities/weather-forecast.entity';
import { Model } from 'mongoose';

@Injectable()
export class WeatherForecastService {
  constructor(
    @InjectModel(WeatherForecast.name)
    private weatherForecastModel: Model<WeatherForecast>,
  ) {}

  async create(createWeatherForecastDto: CreateWeatherForecastDto) {
    await this.weatherForecastModel.create(createWeatherForecastDto);
  }

  async findAll() {
    const forecasts = await this.weatherForecastModel.find();
    return forecasts;
  }

  async findOne(id: string) {
    const forecast = await this.weatherForecastModel.findById(id);
    return forecast;
  }
}
