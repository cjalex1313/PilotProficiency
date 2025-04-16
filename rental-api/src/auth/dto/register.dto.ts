import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/users/entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsEnum(Role)
  role: Role;
}
