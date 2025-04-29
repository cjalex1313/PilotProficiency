import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherForecastModule } from './weather-forecast/weather-forecast.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { SkillsModule } from './skills/skills.module';
import { PracticeLogsModule } from './practice-logs/practice-logs.module';

@Module({
  imports: [
    WeatherForecastModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTIONSTRING ?? ''),
    AuthModule,
    UsersModule,
    EmailModule,
    SkillsModule,
    PracticeLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
