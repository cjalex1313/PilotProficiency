import { Test, TestingModule } from '@nestjs/testing';
import { WeatherForecastController } from './weather-forecast.controller';
import { WeatherForecastService } from './weather-forecast.service';
import { CreateWeatherForecastDto } from './dto/create-weather-forecast.dto';

// Create a mock object for the WeatherForecastService
// We use jest.fn() to create mock functions for each method we need to test.
const mockWeatherForecastService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('WeatherForecastController', () => {
  let controller: WeatherForecastController;

  beforeEach(async () => {
    // Create a testing module using NestJS's testing utilities
    const module: TestingModule = await Test.createTestingModule({
      // Declare the controller we want to test
      controllers: [WeatherForecastController],
      // Provide the dependencies for the controller
      providers: [
        {
          // Specify the token (the class name) of the provider to override
          provide: WeatherForecastService,
          // Provide our mock object instead of the real service implementation
          useValue: mockWeatherForecastService,
        },
      ],
    }).compile(); // Compile the module

    // Get an instance of the controller from the testing module
    // NestJS handles injecting the mock service into the controller
    controller = module.get<WeatherForecastController>(
      WeatherForecastController,
    );
    // Reset mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  // Test suite for the controller itself
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test suite for the create method
  describe('create', () => {
    it('should call weatherForecastService.create with the correct DTO', async () => {
      // Arrange: Define the input DTO
      const createDto: CreateWeatherForecastDto = {
        locations: 'Craiova',
        temperature: 25,
      };
      // Arrange: Mock the return value (optional, but good practice)
      // Here we just make it return the input DTO for simplicity
      mockWeatherForecastService.create.mockResolvedValue(createDto);

      // Act: Call the controller method
      await controller.create(createDto);

      // Assert: Check if the service's create method was called exactly once
      expect(mockWeatherForecastService.create).toHaveBeenCalledTimes(1);
      // Assert: Check if the service's create method was called with the correct argument
      expect(mockWeatherForecastService.create).toHaveBeenCalledWith(createDto);
    });
  });

  // Test suite for the findAll method
  describe('findAll', () => {
    it('should call weatherForecastService.findAll', async () => {
      // Arrange: Mock the return value (optional)
      mockWeatherForecastService.findAll.mockResolvedValue([]); // Mocking an empty array return

      // Act: Call the controller method
      await controller.findAll();

      // Assert: Check if the service's findAll method was called exactly once
      expect(mockWeatherForecastService.findAll).toHaveBeenCalledTimes(1);
      // Assert: Check if it was called without any arguments (as expected)
      expect(mockWeatherForecastService.findAll).toHaveBeenCalledWith();
    });
  });

  // Test suite for the findOne method
  describe('findOne', () => {
    it('should call weatherForecastService.findOne with the correct id', async () => {
      // Arrange: Define a test ID
      const testId = 'some-unique-id-123';
      // Arrange: Mock the return value (optional)
      mockWeatherForecastService.findOne.mockResolvedValue({
        id: testId /* other props */,
      });

      // Act: Call the controller method
      await controller.findOne(testId);

      // Assert: Check if the service's findOne method was called exactly once
      expect(mockWeatherForecastService.findOne).toHaveBeenCalledTimes(1);
      // Assert: Check if the service's findOne method was called with the correct ID
      expect(mockWeatherForecastService.findOne).toHaveBeenCalledWith(testId);
    });
  });
});
