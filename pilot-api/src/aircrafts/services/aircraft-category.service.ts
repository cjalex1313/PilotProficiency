import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AircraftCategory } from '../entities/aircraft-category.entity';
import { Model } from 'mongoose';
import { UpdateAircraftCategoryDto } from '../dtos/aircraft-category.dto';

@Injectable()
export class AircraftCategoryService {
  constructor(
    @InjectModel(AircraftCategory.name)
    private aircraftCategoryModel: Model<AircraftCategory>,
  ) {}

  async getAiractaftCategories() {
    const categories = await this.aircraftCategoryModel.find();
    return categories;
  }

  async getAircraftCategory(id: string) {
    const category = await this.aircraftCategoryModel.findById(id);
    if (category == null) {
      throw new NotFoundException(
        `Aircraft category with Id ${id} does not exist`,
      );
    }
    return category;
  }

  async createAircraftCategory(name: string) {
    const category = await this.aircraftCategoryModel.create({
      name: name,
    });
    return category;
  }

  async updateAircraftCategory(dto: UpdateAircraftCategoryDto) {
    const category = await this.aircraftCategoryModel.findById(dto.id);
    if (category == null) {
      throw new NotFoundException(
        `Aircraft category with Id ${dto.id} does not exist`,
      );
    }
    category.name = dto.name;
    await category.save();
    return category;
  }

  async deleteAircraftCategory(id: string) {
    const category = await this.aircraftCategoryModel.findById(id);
    if (category == null) {
      throw new NotFoundException(
        `Aircraft category with Id ${id} does not exist`,
      );
    }
    await category.deleteOne();
  }
}
