import { HttpException, HttpStatus } from '@nestjs/common';

export const EXCEPTIONS_IDS = {
  EMAIL_ALREADY_EXISTS: 1,
  EMAIL_NOT_VALID: 2,
  EMAIL_NOT_CONFIRMED: 3,
  EMAIL_NOT_FOUND: 4,
  INCORRECT_PASSWORD: 5,
};

export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    const pilotError = {
      id: EXCEPTIONS_IDS.EMAIL_ALREADY_EXISTS,
      email,
      message: `Email ${email} already exists`,
    };
    super(
      {
        pilotError,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class EmailNotValidException extends HttpException {
  constructor(email: string) {
    const pilotError = {
      id: EXCEPTIONS_IDS.EMAIL_NOT_VALID,
      email,
      message: `${email} is not a valid email`,
    };
    super(
      {
        pilotError,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EmailNotConfirmedException extends HttpException {
  constructor(email: string) {
    const pilotError = {
      id: EXCEPTIONS_IDS.EMAIL_NOT_CONFIRMED,
      email,
      message: `${email} is not confirmed. Please check your email.`,
    };
    super(
      {
        pilotError,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EmailNotFoundException extends HttpException {
  constructor() {
    const pilotError = {
      id: EXCEPTIONS_IDS.EMAIL_NOT_FOUND,
      message: 'Email not found',
    };
    super(
      {
        pilotError,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class IncorrectPasswordException extends HttpException {
  constructor() {
    const pilotError = {
      id: EXCEPTIONS_IDS.INCORRECT_PASSWORD,
      message: 'Incorrect password',
    };
    super(
      {
        pilotError,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
