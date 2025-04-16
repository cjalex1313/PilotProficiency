import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailConfirmationDto } from './dto/email-confirmation.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.role,
    );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }

  @Public()
  @Post('reset-password-request')
  async resetPasswordRequest(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    await this.authService.requestPasswordReset(resetPasswordRequestDto.email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() passwordResetDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      passwordResetDto.userId,
      passwordResetDto.token,
      passwordResetDto.newPassword,
    );
  }

  @Public()
  @Patch('confirm-email')
  async confirmEmail(@Body() confirmEmailDto: EmailConfirmationDto) {
    await this.authService.confirmEmail(
      confirmEmailDto.userId,
      confirmEmailDto.token,
    );
  }
}
