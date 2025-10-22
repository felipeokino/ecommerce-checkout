export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(name: string, httpCode: number, description: string, isOperational: boolean) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export class ValidationError extends AppError {
  constructor(description: string) {
    super('ValidationError', 400, description, true);
  }
}

export class DatabaseError extends AppError {
  constructor(description: string) {
    super('DatabaseError', 500, description, true);
  }
}

export class NotFoundError extends AppError {
  constructor(description: string) {
    super('NotFoundError', 404, description, true);
  }
}

export class UnauthorizedError extends AppError {
  constructor(description: string) {
    super('UnauthorizedError', 401, description, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(description: string) {
    super('ForbiddenError', 403, description, true);
  }
}

export class InternalServerError extends AppError {
  constructor(description: string) {
    super('InternalServerError', 500, description, false);
  }
}

export class DuplicateEntryError extends AppError {
  constructor(description: string) {
    super('DuplicateEntryError', 409, description, true);
  }
}