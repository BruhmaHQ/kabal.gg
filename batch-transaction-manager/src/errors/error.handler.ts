import { NextFunction, Request, Response } from "express";
import { errors } from "./error.constants";

const errorHandler =
  () => (err: Error | any, req: Request, res: Response, next: NextFunction) => {
    if (err?.errorCode) {
      res.status(err.errorCode).json({
        success: false,
        message: `ErrorName: ${err.message}`,
      });
    } else {
      res
        .status(errors.INTERNAL_SERVER_ERROR.errorCode)
        .json(errors.INTERNAL_SERVER_ERROR);
    }
  };

export default errorHandler;
