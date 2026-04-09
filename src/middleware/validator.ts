import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

module.exports = (Schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { body, query, params } = req;
    const payload = { ...body, ...params, ...query };
    const result = Schema.safeParse(payload);
    if (!result.success) {
      return res.status(400).json({
        error: { message: result.error.issues.map((error) => error.message) },
      });
    }  
    next();
  };