import { SkillDto } from 'src/skills/dtos/skill.dto';
import { ProficiencyLevel } from 'src/skills/entities/practice-log.entity';

export interface PracticeLogDto {
  id: string;
  userId: string;
  skillId: string;
  skill?: SkillDto | null;
  practiceDate: Date;
  proficiency: ProficiencyLevel;
  notes?: string;
}
