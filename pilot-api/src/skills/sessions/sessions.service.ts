import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from '../entities/session.entity';
import { Model } from 'mongoose';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionsModel: Model<Session>,
  ) {}

  async getUserSessions(userId: string) {
    const sessions = await this.sessionsModel.find({ userId });
    return sessions;
  }
}
