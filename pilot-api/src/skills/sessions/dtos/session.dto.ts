import { SessionStatus } from 'src/skills/entities/session.entity';
import { SessionSkillDto } from './session-skill.dto';

export interface SessionDto {
  id: string;
  name?: string | null;
  date: Date;
  durationMinutes?: number | null;
  notes?: string | null;
  status: SessionStatus;
  skills?: SessionSkillDto[];
}
