import { Types } from 'mongoose';

export interface SkillDto {
  id: string;
  name: string;
  description?: string | null;
  instructions?: string | null;
  categoryId: Types.ObjectId;
  relatedSkillIds?: Types.ObjectId[] | null;
}
