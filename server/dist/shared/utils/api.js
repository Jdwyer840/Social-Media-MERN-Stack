import { ErrorMessages } from '../types/errors.js';
// interface IApiResponse {
//     message: string;
//     success: boolean;
//     error?: string;
// }
export const sendErrorResponse = (res, errorType, statusCode) => {
    const response = {
        error: errorType,
        message: ErrorMessages[errorType],
        success: false
    };
    return res.status(statusCode).json(response);
};
