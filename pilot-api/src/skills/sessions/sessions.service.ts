import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionStatus } from '../entities/session.entity';
import { Model, Types } from 'mongoose';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { SessionNotFoundException } from 'src/shared/exceptions';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionsModel: Model<Session>,
  ) {}

  async getUserSessions(userId: string) {
    const sessions = await this.sessionsModel.find({ userId });
    return sessions;
  }

  async createSession(createSessionDto: CreateSessionDto, userId: string) {
    const session = await this.sessionsModel.create({
      userId,
      name: createSessionDto.name,
      date: createSessionDto.date,
      durationMinutes: createSessionDto.durationMinutes,
      notes: createSessionDto.notes,
      status: SessionStatus.PLANNED,
      skills: createSessionDto.skills,
    });
    return session;
  }

  async updateSession(updateSessionDto: UpdateSessionDto, userId: string) {
    const entity = await this.sessionsModel.findById(updateSessionDto.id);
    if (entity == null) {
      throw new SessionNotFoundException(updateSessionDto.id);
    }
    if (entity.userId.toString() != userId) {
      throw new ForbiddenException();
    }
    entity.name = updateSessionDto.name;
    entity.date = updateSessionDto.date;
    entity.durationMinutes = updateSessionDto.durationMinutes;
    entity.notes = updateSessionDto.notes;
    entity.skills = updateSessionDto.skills
      ? updateSessionDto.skills.map((s) => {
          return {
            skillId: new Types.ObjectId(s.skillId),
            numberOfTrials: s.numberOfTrials,
          };
        })
      : [];
    await entity.save();
    return entity;
  }
}
