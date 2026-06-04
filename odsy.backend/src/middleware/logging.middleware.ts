import { Request, Response, NextFunction } from "express";

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now(); // Cекундомір

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `[${req.method}] ${req.originalUrl} -> ${res.statusCode} | ${duration}ms`
    );
  });

  next();
};