import { Response } from 'express';

type TResponseData<T> = {
  statusCode: number;
  success?: boolean;
  message?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  return res.status(data?.statusCode).json({
    success: true,
    message: data?.message,
    data: data?.data,
  });
};

export default sendResponse;
