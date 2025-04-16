import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Role, User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EmailNotFoundException,
  EmailNotValidException,
} from 'src/shared/exceptions';
import { EmailService } from 'src/email/email.service';
import * as crypto from 'node:crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
  ) {}

  async findById(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async createUser(email: string, password: string, role: Role) {
    if (!this.isValidEmail(email)) {
      throw new EmailNotValidException(email);
    }
    const confirmationToken = this.generateSecureToken();
    const savedUser = await this.userModel.create({
      email,
      emailConfirmed: false,
      passwordHash: password,
      emailConfirmatioToken: confirmationToken,
      roles: [role],
    });
    await this.emailService.sendUserWelcome(
      email,
      confirmationToken,
      savedUser.id as string,
    );
    return savedUser;
  }

  async confirmEmail(userId: string, token: string) {
    const user = await this.userModel.findById(userId);
    if (user == null) {
      throw new BadRequestException(`No user found for userId - ${userId}`);
    }
    if (user.emailConfirmatioToken != token) {
      throw new BadRequestException(`Invalid token for email confirmation`);
    }
    user.emailConfirmed = true;
    await user.save();
  }

  async requestPasswordReset(email: string) {
    const user = await this.findByEmail(email);
    if (user == null) {
      throw new EmailNotFoundException();
    }
    const passwordResetToken = this.generateSecureToken();
    user.passwordResetToken = passwordResetToken;
    await user.save();
    await this.emailService.sendPasswordReset(
      email,
      user.id as string,
      passwordResetToken,
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateSecureToken(
    lengthInBytes: number = 32,
    encoding: 'hex' | 'base64' | 'base64url' = 'base64url',
  ): string {
    // Generate cryptographically secure random bytes
    const buffer = crypto.randomBytes(lengthInBytes);

    // Convert the random bytes to the specified string encoding
    return buffer.toString(encoding);
  }
}
