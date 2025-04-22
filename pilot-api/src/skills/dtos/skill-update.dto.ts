import { IsMongoId, IsOptional } from 'class-validator';

export class SkillUpdateDto {
  @IsMongoId()
  id: string;
  name: string;
  description?: string | null;
  instructions?: string | null;
  @IsMongoId()
  categoryId: string;
  @IsOptional()
  @IsMongoId({ each: true })
  relatedSkillIds?: string[] | null;
}
