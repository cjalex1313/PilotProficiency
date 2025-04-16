/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailConfirmationDto } from './dto/email-confirmation.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role } from 'src/users/entities/user.entity';

// Create a mock AuthService type
type MockAuthService = {
  [K in keyof AuthService]: jest.Mock;
};

// Factory function to create the mock AuthService
const authServiceMockFactory: () => MockAuthService = jest.fn(() => ({
  signIn: jest.fn(),
  register: jest.fn(),
  requestPasswordReset: jest.fn(),
  resetPassword: jest.fn(),
  confirmEmail: jest.fn(),
  onModuleInit: jest.fn(),
  // Add mocks for any other methods if needed for guards or other interactions
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: authServiceMockFactory, // Use the factory for a fresh mock each time
        },
      ],
    })
      // Mock the AuthGuard - prevent it from running its logic (canActivate)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock guard to always allow access
      .compile();

    controller = module.get<AuthController>(AuthController);
    // Get the mocked instance of AuthService
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Test signIn ---
  describe('signIn', () => {
    it('should call authService.signIn with correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      // Mock the return value if needed, though not required for just checking calls
      authService.signIn.mockResolvedValue({ access_token: 'mockToken' });

      await controller.signIn(loginDto);

      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  // --- Test register ---
  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'newpassword',
        role: Role.Pilot,
      };
      // Mock the return value (void in this case)
      authService.register.mockResolvedValue(undefined);

      await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.role,
      );
    });
  });

  // --- Test getProfile ---
  describe('getProfile', () => {
    it('should return the user from the request object', () => {
      const mockUser = {
        userId: 1,
        email: 'test@example.com',
        role: Role.Pilot,
      };
      const mockRequest = { user: mockUser }; // Simulate request object after guard adds user

      const result = controller.getProfile(mockRequest);

      // No service call happens directly within getProfile method body itself
      // The guard interaction is mocked out by overrideGuard
      expect(result).toEqual(mockUser);
    });
  });

  // --- Test resetPasswordRequest ---
  describe('resetPasswordRequest', () => {
    it('should call authService.requestPasswordReset with correct parameters', async () => {
      const resetPasswordRequestDto: ResetPasswordRequestDto = {
        email: 'forgot@example.com',
      };
      // Mock the return value (void in this case)
      authService.requestPasswordReset.mockResolvedValue(undefined);

      await controller.resetPasswordRequest(resetPasswordRequestDto);

      expect(authService.requestPasswordReset).toHaveBeenCalledTimes(1);
      expect(authService.requestPasswordReset).toHaveBeenCalledWith(
        resetPasswordRequestDto.email,
      );
    });
  });

  // --- Test resetPassword ---
  describe('resetPassword', () => {
    it('should call authService.resetPassword with correct parameters', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        userId: 'user-id-123',
        token: 'reset-token-abc',
        newPassword: 'newSecurePassword!',
      };
      // Mock the return value (void in this case)
      authService.resetPassword.mockResolvedValue(undefined);

      await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledTimes(1);
      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.userId,
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
    });
  });

  // --- Test confirmEmail ---
  describe('confirmEmail', () => {
    it('should call authService.confirmEmail with correct parameters', async () => {
      const confirmEmailDto: EmailConfirmationDto = {
        userId: 'user-id-456',
        token: 'confirm-token-xyz',
      };
      // Mock the return value (void in this case)
      authService.confirmEmail.mockResolvedValue(undefined);

      await controller.confirmEmail(confirmEmailDto);

      expect(authService.confirmEmail).toHaveBeenCalledTimes(1);
      expect(authService.confirmEmail).toHaveBeenCalledWith(
        confirmEmailDto.userId,
        confirmEmailDto.token,
      );
    });
  });
});
