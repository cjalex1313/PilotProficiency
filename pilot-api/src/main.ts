import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigDto } from './config/configDto';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow all origins (use with caution in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Specify allowed methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Specify allowed headers
    credentials: false, // Allow cookies/authorization headers to be sent (adjust if not needed)
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const config = configService.get<ConfigDto>('config');
  if (!config) {
    throw new Error('No config object');
  }
  await app.listen(config?.port);
}
void bootstrap();
