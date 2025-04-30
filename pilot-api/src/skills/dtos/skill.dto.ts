import { Types } from 'mongoose';
import { CategoryDto } from './category/category.dto';
import { PracticeLogDto } from './category/practice-log.dto';

export interface SkillDto {
  id: string;
  name: string;
  description?: string | null;
  instructions?: string | null;
  categoryId: Types.ObjectId;
  category?: CategoryDto | null;
  relatedSkillIds?: Types.ObjectId[] | null;
  relatedSkills?: SkillDto[] | null;
}

export interface SkillFullDto extends SkillDto {
  latestPracticeLog?: PracticeLogDto | null;
}
