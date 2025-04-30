import { ProficiencyLevel } from '../entities/practice-log.entity';

export interface PracticeLogUpdateDto {
  id: string;
  practiceDate: Date;
  proficiency: ProficiencyLevel;
  notes?: string;
}
