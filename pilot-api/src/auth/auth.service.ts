import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import {
  EmailAlreadyExistsException,
  EmailNotConfirmedException,
  EmailNotFoundException,
  IncorrectPasswordException,
} from 'src/shared/exceptions';
import { Role } from 'src/users/entities/user.entity';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ConfigDto } from 'src/config/configDto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const config = this.configService.get<ConfigDto>('config');
    if (!config) {
      throw new Error('Config is null in EmailService');
    }
    const adminUser = await this.usersService.findByEmail(config.admin.email);
    if (adminUser != null) {
      if (!adminUser.roles.includes(Role.Admin)) {
        adminUser.roles.push(Role.Admin);
        await adminUser.save();
      }
    } else {
      const passwordHash = await this.hashPassword(config.admin.password);
      await this.usersService.createUser(
        config.admin.email,
        passwordHash,
        Role.Admin,
      );
    }
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user == null) {
      throw new EmailNotFoundException();
    }
    const passwordMaches = await argon2.verify(user.passwordHash, pass);
    if (!passwordMaches) {
      throw new IncorrectPasswordException();
    }
    if (!user.emailConfirmed) {
      throw new EmailNotConfirmedException(email);
    }
    const payload = { sub: user._id, email: user.email, roles: user.roles };
    const result = {
      accessToken: await this.jwtService.signAsync(payload),
    };
    return result;
  }

  async register(email: string, password: string, role: Role) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser != null) {
      throw new EmailAlreadyExistsException(email);
    }
    const passwordHash = await this.hashPassword(password);
    await this.usersService.createUser(email, passwordHash, role);
  }

  async confirmEmail(userId: string, token: string) {
    await this.usersService.confirmEmail(userId, token);
  }

  async requestPasswordReset(email: string) {
    await this.usersService.requestPasswordReset(email);
  }

  async resetPassword(userId: string, token: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    if (user.passwordResetToken != token) {
      throw new BadRequestException(
        'Token for password reset invalid or outdated',
      );
    }
    const newPasswordHash = await this.hashPassword(newPassword);
    user.passwordHash = newPasswordHash;
    user.passwordResetToken = null;
    await user.save();
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id, // Recommended type
    });
    return hashedPassword;
  }
}
