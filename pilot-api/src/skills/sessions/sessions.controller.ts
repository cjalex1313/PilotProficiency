/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { mapSessiontoDto } from 'src/helpers';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get('')
  async getSessions(@Request() req) {
    const userId: string = req?.user?.sub;
    const sessions = await this.sessionsService.getUserSessions(userId);
    const response = sessions.map((s) => mapSessiontoDto(s));
    return response;
  }

  @Post('')
  async createSession(
    @Request() req,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    const userId: string = req?.user?.sub;
    const session = await this.sessionsService.createSession(
      createSessionDto,
      userId,
    );
    const response = mapSessiontoDto(session);
    return response;
  }

  @Put('')
  async updateSession(
    @Request() req,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    const userId: string = req?.user?.sub;
    const session = await this.sessionsService.updateSession(
      updateSessionDto,
      userId,
    );
    const response = mapSessiontoDto(session);
    return response;
  }
}
