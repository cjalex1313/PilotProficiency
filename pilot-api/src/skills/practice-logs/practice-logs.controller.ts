/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { PracticeLogsService } from './practice-logs.service';
import { mapPracticeLogToDto } from 'src/helpers';
import { PracticeLogCreateDto } from '../dtos/practice-log-create.dto';
import { PracticeLogUpdateDto } from '../dtos/practice-log-update.dto';

@Controller('practice-logs')
export class PracticeLogsController {
  constructor(private practiceLogsService: PracticeLogsService) {}

  @Get('')
  async getUserPracticeLogs(@Request() req) {
    const userId: string = req?.user?.sub;
    const practiceLogs =
      await this.practiceLogsService.getUserPracticeLogs(userId);
    const dtos = practiceLogs.map((pl) => mapPracticeLogToDto(pl));
    return dtos;
  }

  @Get('skill/:skillId')
  async getPracticeLogsForUserSkill(
    @Request() req,
    @Param('skillId') skillId: string,
  ) {
    const userId: string = req?.user?.sub;
    const practiceLogs =
      await this.practiceLogsService.getPracticeLogsForUserSkill(
        userId,
        skillId,
      );
    const dtos = practiceLogs.map((pl) => mapPracticeLogToDto(pl));
    return dtos;
  }

  @Post('')
  async createPracticeLog(
    @Request() req,
    @Body() logDto: PracticeLogCreateDto,
  ) {
    const userId: string = req?.user?.sub;
    const practiceLog = await this.practiceLogsService.createPracticeLog(
      logDto,
      userId,
    );
    const practiceLogDto = mapPracticeLogToDto(practiceLog);
    return practiceLogDto;
  }

  @Put('')
  async updatePracticeLog(
    @Request() req,
    @Body() logDto: PracticeLogUpdateDto,
  ) {
    const userId: string = req?.user?.sub;
    const practiceLog = await this.practiceLogsService.updatePracticeLog(
      logDto,
      userId,
    );
    const practiceLogDto = mapPracticeLogToDto(practiceLog);
    return practiceLogDto;
  }

  @Delete(':id')
  async deletePracticeLog(@Request() req, @Param('id') id: string) {
    const userId: string = req?.user?.sub;
    await this.practiceLogsService.deletePracticeLog(userId, id);
  }
}
