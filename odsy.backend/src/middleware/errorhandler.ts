import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
  status?: number;
  code?: string;
  details?: unknown[];
}

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const msg = err.message || "";

  //  default status
  let statusCode = Number(err.statusCode || err.status) || 500;

  let code = err.code || "INTERNAL_SERVER_ERROR";

  // SQLite → HTTP mapping
  if (msg.includes("UNIQUE constraint failed")) {
    statusCode = 409;
    code = "CONFLICT";
  }

  if (
    msg.includes("NOT NULL constraint failed") ||
    msg.includes("CHECK constraint failed")
  ) {
    statusCode = 400;
    code = "BAD_REQUEST";
  }

  if (msg.includes("no such table")) {
    statusCode = 500;
    code = "DB_SCHEMA_ERROR";
  }

  if (msg.includes("SQLITE_ERROR")) {
    statusCode = 500;
    code = "SQL_ERROR";
  }

  // response
  const errorResponse = {
    error: {
      code,
      message: msg || "Internal Server Error",
      details: err.details?.length ? err.details : undefined,
    },
  };

  // logging
  if (process.env.NODE_ENV !== "production") {
    console.error("ERROR:", err);
  } else {
    console.error(`[${code}] ${req.method} ${req.originalUrl}`);
  }

  return res.status(statusCode).json(errorResponse);
};