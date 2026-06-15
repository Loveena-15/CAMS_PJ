import { Response } from 'express';

interface ResponseData {
  res: Response;
  statusCode: number;
  message: string;
  data?: any;
}

export const sendResponse = ({ res, statusCode, message, data = null }: ResponseData) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};
