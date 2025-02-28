export class AppError extends Error {
  public status: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.status = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
