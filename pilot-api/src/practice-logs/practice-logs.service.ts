import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PracticeLog } from './entities/practice-log.entity';
import { Model } from 'mongoose';
import { PracticeLogCreateDto } from './dtos/practice-log-create.dto';
import { PracticeLogUpdateDto } from './dtos/practice-log-update.dto';

@Injectable()
export class PracticeLogsService {
  constructor(
    @InjectModel(PracticeLog.name) private practiceLogModel: Model<PracticeLog>,
  ) {}

  async getUserPracticeLogs(userId: string) {
    const practiceLogs = await this.practiceLogModel.find({ userId: userId });
    return practiceLogs;
  }

  async getPracticeLogsForUserSkill(userId: string, skillId: string) {
    const practiceLogs = await this.practiceLogModel.find({ userId, skillId });
    return practiceLogs;
  }

  async createPracticeLog(dto: PracticeLogCreateDto, userId: string) {
    const practiceLog = await this.practiceLogModel.create({
      userId: userId,
      skillId: dto.skillId,
      practiceDate: dto.practiceDate,
      proficiency: dto.proficiency,
      notes: dto.notes,
    });
    return practiceLog;
  }

  async updatePracticeLog(logDto: PracticeLogUpdateDto, userId: string) {
    const practiceLog = await this.practiceLogModel.findById(logDto.id);
    if (practiceLog == null) {
      throw new NotFoundException(
        `Practice log with id ${logDto.id} not found`,
      );
    }
    if (practiceLog.userId.toString() != userId) {
      throw new ForbiddenException(
        `User with id ${userId} is not allowed to edit practice log with id ${logDto.id}`,
      );
    }
    practiceLog.practiceDate = logDto.practiceDate;
    practiceLog.proficiency = logDto.proficiency;
    practiceLog.notes = logDto.notes;
    await practiceLog.save();
    return practiceLog;
  }

  async deletePracticeLog(userId: string, id: string) {
    const practiceLog = await this.practiceLogModel.findById(id);
    if (practiceLog == null) {
      throw new NotFoundException(`Practice log with id ${id} not found`);
    }
    if (practiceLog.userId.toString() != userId) {
      throw new ForbiddenException(
        `User with id ${userId} is not allowed to edit practice log with id ${id}`,
      );
    }
    await practiceLog.deleteOne();
  }
}
