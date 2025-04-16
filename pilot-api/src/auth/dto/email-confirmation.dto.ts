import { IsNotEmpty } from 'class-validator';

export class EmailConfirmationDto {
  @IsNotEmpty()
  token: string;
  @IsNotEmpty()
  userId: string;
}
