import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../utils/appError";

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(new AppError("Validation failed", 400));
    }
  };
};
