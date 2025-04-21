import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class SkillCreateDto {
  @IsNotEmpty()
  name: string;
  description?: string | null;
  instructions?: string | null;
  @IsMongoId()
  categoryId: string;
  @IsOptional()
  @IsMongoId({ each: true })
  relatedSkillIds?: string[] | null;
}
