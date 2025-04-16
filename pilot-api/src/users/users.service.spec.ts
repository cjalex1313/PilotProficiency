/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Role, User } from './entities/user.entity';
import { EmailService } from 'src/email/email.service';
import {
  EmailNotFoundException,
  EmailNotValidException,
} from 'src/shared/exceptions';
import { BadRequestException } from '@nestjs/common';

const mockUserModel = {
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockEmailService = {
  sendUserWelcome: jest.fn(),
  sendPasswordReset: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findById should call the findById on the model', async () => {
    const idToFind = '1';
    mockUserModel.findById.mockImplementation((id: string) => {
      return {
        _id: id,
      };
    });

    const user = await service.findById(idToFind);

    expect(user).toHaveProperty('_id', '1');
    expect(mockUserModel.findById).toHaveBeenCalledWith(idToFind);
  });

  it('findByEmail should return a user with the required email', async () => {
    const emailToFind = 'test@test.com';
    mockUserModel.findOne.mockImplementation((obj) => {
      return obj;
    });

    const user = await service.findByEmail(emailToFind);

    expect(user).toHaveProperty('email', emailToFind);
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: emailToFind,
    });
  });

  it('createUser should throw a EmailNotValidException if the email is not valid', async () => {
    const emailToCreate = 'notAnEmail';
    const password = 'password';
    const role: Role = Role.Pilot;

    try {
      await service.createUser(emailToCreate, password, role);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(EmailNotValidException);
    }
  });

  it('createUser should save the user to the db and ', async () => {
    const emailToCreate = 'test@test.com';
    const password = 'password';
    const role: Role = Role.Pilot;

    mockUserModel.create.mockImplementation((user) => {
      return {
        ...user,
        id: '1',
      };
    });

    await service.createUser(emailToCreate, password, role);

    expect(mockEmailService.sendUserWelcome).toHaveBeenCalledWith(
      emailToCreate,
      expect.anything(),
      '1',
    );
    expect(mockUserModel.create).toHaveBeenCalled();
  });

  it('confirmEmail should throw an BadRequestException if the userId is not found', async () => {
    const userId: string = '1';
    const token: string = '123';

    mockUserModel.findById.mockReturnValue(null);

    try {
      await service.confirmEmail(userId, token);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('confirmEmail should throw an BadRequestException if the token is not correct', async () => {
    const userId: string = '1';
    const token: string = '123';

    mockUserModel.findById.mockReturnValue({
      token: '321',
    });

    try {
      await service.confirmEmail(userId, token);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('confirmEmail update emailConfirmed if user is found and token is correct', async () => {
    const userId: string = '1';
    const token: string = '123';
    const returnedUser = {
      emailConfirmatioToken: token,
      emailCOnfirmed: false,
      save: jest.fn(),
    };

    mockUserModel.findById.mockReturnValue(returnedUser);

    await service.confirmEmail(userId, token);

    expect(returnedUser.emailCOnfirmed == true);
    expect(returnedUser.save).toHaveBeenCalled();
  });

  it('requestPasswordReset should throw an EmailNotFoundException if the userId is not found', async () => {
    const email = '1';

    mockUserModel.findOne.mockReturnValue(null);

    try {
      await service.requestPasswordReset(email);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(EmailNotFoundException);
    }
  });

  it('requestPasswordReset should reset the passwordReset token, save the entity and send an email', async () => {
    const email = 'test@gmail.com';
    const retrievedUser = {
      email,
      passwordResetToken: null,
      save: jest.fn(),
    };

    mockUserModel.findOne.mockReturnValue(retrievedUser);

    await service.requestPasswordReset(email);

    expect(retrievedUser.passwordResetToken).toBeTruthy();
    expect(retrievedUser.save).toHaveBeenCalled();
    expect(mockEmailService.sendPasswordReset).toHaveBeenCalled();
  });
});
