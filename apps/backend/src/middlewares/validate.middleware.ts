import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((err) =>`[${err.path.join('.')}] ${err.message}`).join(', ');
        return next(new AppError(message, 400));
      }
      next(error);
    }
  };
};
