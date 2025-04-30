import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PracticeLog } from '../entities/practice-log.entity';
import { PracticeLogCreateDto } from '../dtos/practice-log-create.dto';
import { PracticeLogUpdateDto } from '../dtos/practice-log-update.dto';
import mongoose from 'mongoose';

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

  async getLatestPracticeLogForSkills(userId: string, skillIds: string[]) {
    const userIdAsObjectId = new mongoose.Types.ObjectId(userId);
    const skillIdsAsObjectIds = skillIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const aggregationPipeline = [
      // 1. Match documents for the specific user and the list of skillIds
      {
        $match: {
          userId: userIdAsObjectId,
          skillId: { $in: skillIdsAsObjectIds },
        },
      },
      // 2. Sort by practiceDate descending to get the latest entries first
      {
        $sort: {
          practiceDate: -1 as const,
        },
      },
      // 3. Group by skillId and take the *first* document encountered in each group
      // Since we sorted by date descending, the first document is the latest one.
      {
        $group: {
          _id: '$skillId', // Group by the skillId
          latestLog: { $first: '$$ROOT' }, // Get the entire document of the first entry in the group
        },
      },
      // 4. Replace the root document structure with the actual latestLog document
      {
        $replaceRoot: {
          newRoot: '$latestLog',
        },
      },
    ];

    const result =
      await this.practiceLogModel.aggregate<PracticeLog>(aggregationPipeline);
    return result;
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
