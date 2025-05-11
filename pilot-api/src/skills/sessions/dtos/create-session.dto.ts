import { IsDateString, IsNotEmpty } from 'class-validator';
import { SessionSkillDto } from './session-skill.dto';

export class CreateSessionDto {
  name?: string | null;
  @IsNotEmpty()
  @IsDateString()
  date: Date;
  durationMinutes?: number | null;
  notes?: string | null;
  skills?: SessionSkillDto[];
}
