export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown[];

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "SERVER_ERROR",
    details?: unknown[]
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}