import { IsNotEmpty } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  email: string;
}
