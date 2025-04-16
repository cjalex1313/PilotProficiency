import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  token: string;
  @IsNotEmpty()
  newPassword: string;
}
