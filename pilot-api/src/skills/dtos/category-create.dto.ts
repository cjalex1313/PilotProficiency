import { IsNotEmpty } from 'class-validator';

export class CategoryCreateDto {
  @IsNotEmpty()
  name: string;
  description?: string | null;
}
