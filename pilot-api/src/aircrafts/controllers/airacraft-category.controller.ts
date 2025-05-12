import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AircraftCategoryService } from '../services/aircraft-category.service';
import { mapAiracraftCategoryToDto } from 'src/helpers';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import {
  CreateAircraftCategoryDto,
  UpdateAircraftCategoryDto,
} from '../dtos/aircraft-category.dto';

@Controller('aircarft-category')
export class AircraftCatogryController {
  constructor(private aircraftCategoryService: AircraftCategoryService) {}

  @Get('')
  async getAircraftCategories() {
    const categories =
      await this.aircraftCategoryService.getAiractaftCategories();
    const respsonse = categories.map((c) => mapAiracraftCategoryToDto(c));
    return respsonse;
  }

  @Get(':id')
  async getAircraftCategory(@Param('id') id: string) {
    const category = await this.aircraftCategoryService.getAircraftCategory(id);
    const response = mapAiracraftCategoryToDto(category);
    return response;
  }

  @Post('')
  @Roles(Role.Admin)
  async createAircraftCategory(@Body() dto: CreateAircraftCategoryDto) {
    const category = await this.aircraftCategoryService.createAircraftCategory(
      dto.name,
    );
    const response = mapAiracraftCategoryToDto(category);
    return response;
  }

  @Put('')
  @Roles(Role.Admin)
  async updateAircraftCategory(@Body() dto: UpdateAircraftCategoryDto) {
    const category =
      await this.aircraftCategoryService.updateAircraftCategory(dto);
    const response = mapAiracraftCategoryToDto(category);
    return response;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteAircraftCategory(@Param('id') id: string) {
    await this.aircraftCategoryService.deleteAircraftCategory(id);
  }
}
