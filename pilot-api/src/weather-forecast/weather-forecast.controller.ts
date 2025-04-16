import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WeatherForecastService } from './weather-forecast.service';
import { CreateWeatherForecastDto } from './dto/create-weather-forecast.dto';

@Controller('weather-forecast')
export class WeatherForecastController {
  constructor(
    private readonly weatherForecastService: WeatherForecastService,
  ) {}

  @Post()
  async create(@Body() createWeatherForecastDto: CreateWeatherForecastDto) {
    return await this.weatherForecastService.create(createWeatherForecastDto);
  }

  @Get()
  async findAll() {
    return await this.weatherForecastService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.weatherForecastService.findOne(id);
  }
}
