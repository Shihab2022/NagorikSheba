import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects, ZodError } from "zod";
import httpStatus from "http-status";

const validateRequest =
  (schema: AnyZodObject | ZodEffects<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        next({
          statusCode: httpStatus.BAD_REQUEST,
          message: "Validation error",
          errorMessages,
        });
      } else {
        next(err);
      }
    }
  };

export default validateRequest;
