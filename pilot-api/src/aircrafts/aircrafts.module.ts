import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AircraftCategory,
  AircraftCategorySchema,
} from './entities/aircraft-category.entity';
import { AircraftCatogryController } from './controllers/airacraft-category.controller';
import { AircraftCategoryService } from './services/aircraft-category.service';

@Module({
  providers: [AircraftCategoryService],
  controllers: [AircraftCatogryController],
  imports: [
    MongooseModule.forFeature([
      { name: AircraftCategory.name, schema: AircraftCategorySchema },
    ]),
  ],
})
export class AircraftsModule {}
