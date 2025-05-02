/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { mapSessiontoDto } from 'src/helpers';

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
}
