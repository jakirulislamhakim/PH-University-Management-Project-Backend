import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const parseBodyDataTextToJson = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.data) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Data is not given by form data in data property',
    );
  }

  req.body = JSON.parse(req.body?.data);
  next();
};

export default parseBodyDataTextToJson;
