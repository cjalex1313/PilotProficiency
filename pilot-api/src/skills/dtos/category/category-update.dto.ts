import { IsNotEmpty } from 'class-validator';

export class CategoryUpdateDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  name: string;
  description?: string | null;
}
