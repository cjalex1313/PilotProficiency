import { Test, TestingModule } from '@nestjs/testing';
import { WeatherForecastService } from './weather-forecast.service';
import { getModelToken } from '@nestjs/mongoose';
import { WeatherForecast } from './entities/weather-forecast.entity';
import { CreateWeatherForecastDto } from './dto/create-weather-forecast.dto';

const mockWeatherModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
};

describe('WeatherForecastService', () => {
  let service: WeatherForecastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherForecastService,
        {
          provide: getModelToken(WeatherForecast.name),
          useValue: mockWeatherModel,
        },
      ],
    }).compile();

    service = module.get<WeatherForecastService>(WeatherForecastService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call create on the model on the create method', async () => {
    const entityToBeCreated: CreateWeatherForecastDto = {
      locations: 'Craiova',
      temperature: 30,
    };

    await service.create(entityToBeCreated);

    expect(mockWeatherModel.create).toHaveBeenCalledWith(entityToBeCreated);
  });

  it('should should call the find method on the model on the findAll method', async () => {
    const entitiesToReturn = [
      {
        location: 'Craiova',
        temperature: 30,
      },
      {
        location: 'Bucuresti',
        temperature: 28,
      },
    ];

    mockWeatherModel.find.mockReturnValue(entitiesToReturn);

    const allForecasts = await service.findAll();

    expect(mockWeatherModel.find).toHaveBeenCalled();
    expect(allForecasts).toBe(entitiesToReturn);
  });

  it('should call the findById method on the model on the findOne method', async () => {
    const idToFind = '1';
    const entityToReturn = {
      _id: idToFind,
      location: 'Craiova',
      temperature: 30,
    };

    mockWeatherModel.findById.mockReturnValue(entityToReturn);

    const weatherForecast = await service.findOne(idToFind);

    expect(weatherForecast).toBe(entityToReturn);
    expect(mockWeatherModel.findById).toHaveBeenCalledWith(idToFind);
  });
});
