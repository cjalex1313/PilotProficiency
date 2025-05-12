import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AircraftCategoryDto {
  @IsMongoId()
  id: string;
  @IsNotEmpty()
  name: string;
}

export class CreateAircraftCategoryDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateAircraftCategoryDto {
  @IsMongoId()
  id: string;
  @IsNotEmpty()
  name: string;
}
