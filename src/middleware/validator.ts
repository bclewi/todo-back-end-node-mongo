import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // sequential processing
      // stops running validations chain if the previous one fails
      for (let validation of validations) {
        const result = await validation.run(req);
        if (result.context.errors.length) break;
      }

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      return res.status(400).json({
        errors: errors.array(),
      });
    } catch (err) {
      return res.status(500).json({
        message: "internal error during validation",
      });
    }
  };
};

export { validate };
