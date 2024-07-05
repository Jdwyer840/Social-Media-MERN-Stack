import { Response } from "express";
import { ErrorType, ErrorMessages } from '../types/errors';
import { IApiResponse } from '../types/api';

// interface IApiResponse {
//     message: string;
//     success: boolean;
//     error?: string;
// }


export const sendErrorResponse = (res: Response, errorType: ErrorType, statusCode: number): Response => {
    const response: IApiResponse = {
        error: errorType,
        message: ErrorMessages[errorType],
        success: false
    }

    return res.status(statusCode).json(response);
}
