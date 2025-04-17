import { HttpException, HttpStatus } from '@nestjs/common';

export const EXCEPTIONS_IDS = {
  EMAIL_ALREADY_EXISTS: 1,
  EMAIL_NOT_VALID: 2,
  EMAIL_NOT_CONFIRMED: 3,
  EMAIL_NOT_FOUND: 4,
  INCORRECT_PASSWORD: 5,
  CATEGORY_NAME_EXISTS: 6,
  CATEGORY_NOT_FOUND: 7,
};

export class CategoryNotFoundException extends HttpException {
  constructor(id: string) {
    const pilotError = {
      errorId: EXCEPTIONS_IDS.CATEGORY_NOT_FOUND,
      id,
      message: `Cateogry with id ${id} does not exist`,
    };
    super(
      {
        pilotError,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    const pilotError = {
      errorId: EXCEPTIONS_IDS.EMAIL_ALREADY_EXISTS,
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
      errorId: EXCEPTIONS_IDS.EMAIL_NOT_VALID,
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
      errorId: EXCEPTIONS_IDS.EMAIL_NOT_CONFIRMED,
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
      errorId: EXCEPTIONS_IDS.EMAIL_NOT_FOUND,
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
      errorId: EXCEPTIONS_IDS.INCORRECT_PASSWORD,
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

export class CategoryNameExistsException extends HttpException {
  constructor(name: string) {
    const pilotError = {
      errorId: EXCEPTIONS_IDS.CATEGORY_NAME_EXISTS,
      message: `Category with name ${name} already exists`,
      name,
    };
    super(
      {
        pilotError,
      },
      HttpStatus.CONFLICT,
    );
  }
}
