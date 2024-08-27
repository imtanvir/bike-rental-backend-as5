import { Response } from "express";
import { TResponse } from "../interface";

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  res.status(responseData.statusCode as number).json({
    success: responseData.success,
    statusCode: responseData.statusCode,
    message: responseData.message,
    token: responseData.token,
    data: responseData.data,
  });
};

export default sendResponse;
