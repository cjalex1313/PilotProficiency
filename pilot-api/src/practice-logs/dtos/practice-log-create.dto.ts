import { ProficiencyLevel } from '../entities/practice-log.entity';

export interface PracticeLogCreateDto {
  skillId: string;
  practiceDate: Date;
  proficiency: ProficiencyLevel;
  notes?: string;
}
