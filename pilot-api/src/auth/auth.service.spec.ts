/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EmailAlreadyExistsException,
  EmailNotConfirmedException,
  EmailNotFoundException,
  IncorrectPasswordException,
} from 'src/shared/exceptions';
import { Role } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

const mockArgon2Verify = jest.fn();

jest.mock('argon2', () => ({
  verify: () => mockArgon2Verify(),
  hash: () => 'hashed password',
}));

const mockUserService = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  confirmEmail: jest.fn(),
  requestPasswordReset: jest.fn(),
  findById: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'config')
      return {
        admin: {
          email: 'cioarec.alexandru96@gmail.com',
          password: 'password',
        },
      };
    return null;
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('onModuleInit should throw an error if config is null', async () => {
    mockConfigService.get.mockReturnValue(null);

    try {
      await service.onModuleInit();
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('onModuleInit should add the Admin role to the user if it already exists', async () => {
    mockConfigService.get.mockReturnValue({
      admin: {
        email: 'cioarec.alexandru96@gmail.com',
        password: 'password',
      },
    });
    const returnedAdminUser: {
      roles: Role[];
      save: any;
    } = {
      roles: [],
      save: jest.fn(),
    };
    mockUserService.findByEmail.mockReturnValue(returnedAdminUser);

    await service.onModuleInit();

    expect(returnedAdminUser.roles.includes(Role.Admin)).toBeTruthy();
    expect(returnedAdminUser.save).toHaveBeenCalled();
  });

  it('onModuleInit should create the admin user if it does not exist', async () => {
    mockConfigService.get.mockReturnValue({
      admin: {
        email: 'cioarec.alexandru96@gmail.com',
        password: 'password',
      },
    });

    mockUserService.findByEmail.mockReturnValue(null);

    await service.onModuleInit();

    expect(mockUserService.createUser).toHaveBeenCalledWith(
      'cioarec.alexandru96@gmail.com',
      'hashed password',
      Role.Admin,
    );
  });

  it('signIn should throw a EmailNotFoundException if email not found', async () => {
    const email = 'test';

    mockUserService.findByEmail.mockReturnValue(null);

    try {
      await service.signIn(email, '');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(EmailNotFoundException);
    }
  });

  it('signIn should throw a IncorrectPasswordException password hash not matches', async () => {
    const email = 'test';
    const pass = 'test';
    mockUserService.findByEmail.mockReturnValue({
      id: '1',
      email,
      passwordHash: '123',
    });
    mockArgon2Verify.mockReturnValue(false);

    try {
      await service.signIn(email, pass);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(IncorrectPasswordException);
    }
  });

  it('signIn should throw a EmailNotConfirmedException if email not confirmed', async () => {
    const email = 'test';
    const pass = 'test';
    mockUserService.findByEmail.mockReturnValue({
      id: '1',
      email,
      passwordHash: '123',
      emailConfirmed: false,
    });
    mockArgon2Verify.mockReturnValue(true);

    try {
      await service.signIn(email, pass);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(EmailNotConfirmedException);
    }
  });

  it('signIn should return an access token', async () => {
    const email = 'test';
    const pass = 'test';
    mockUserService.findByEmail.mockReturnValue({
      _id: '1',
      email,
      passwordHash: '123',
      emailConfirmed: true,
      roles: ['Pilot'],
    });
    mockArgon2Verify.mockReturnValue(true);

    const result = await service.signIn(email, pass);

    expect(result).toBeTruthy();
    expect(result.accessToken).toBeTruthy();
  });

  it('register should throw a EmailAlreadyExistsException if email already used', async () => {
    const email = 'test@gmail.com';
    const password = 'pass';
    const role = Role.Pilot;

    mockUserService.findByEmail.mockReturnValue({ email });

    try {
      await service.register(email, password, role);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(EmailAlreadyExistsException);
    }
  });

  it('register call the create user on userService and return the created user', async () => {
    const email = 'test@gmail.com';
    const password = 'pass';
    const role = Role.Pilot;

    mockUserService.findByEmail.mockReturnValue(null);
    mockUserService.createUser.mockReturnValue({});

    await service.register(email, password, role);

    expect(mockUserService.createUser).toHaveBeenCalled();
  });

  it('confirmEmail should call confirmEmail on userService', async () => {
    const userId = '1';
    const token = 'token';

    await service.confirmEmail(userId, token);

    expect(mockUserService.confirmEmail).toHaveBeenCalled();
  });

  it('requestPasswordReset should call requestPasswordReset on userService', async () => {
    const email = 'email';

    await service.requestPasswordReset(email);

    expect(mockUserService.requestPasswordReset).toHaveBeenCalled();
  });

  it('resetPassword to throw NotFoundException if userId not found', async () => {
    const userId = '0';

    mockUserService.findById.mockReturnValue(null);

    try {
      await service.resetPassword(userId, '', '');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('resetPassword to throw BadRequestException if passwordResetToken not matching', async () => {
    const userId = '0';

    mockUserService.findById.mockReturnValue({
      passwordResetToken: '-1',
    });

    try {
      await service.resetPassword(userId, '', '');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('resetPassword should change the hash to a new one, reset the passwordToken and save the entity', async () => {
    const userId = '0';
    const userToRetrieve = {
      passwordResetToken: '123',
      save: jest.fn(),
      passwordHash: 'initial hash',
    };
    mockUserService.findById.mockReturnValue(userToRetrieve);

    await service.resetPassword(userId, '123', 'test');

    expect(userToRetrieve.passwordHash != 'initial hash').toBe(true);
    expect(userToRetrieve.passwordResetToken).toBeNull();
    expect(userToRetrieve.save).toHaveBeenCalled();
  });
});
