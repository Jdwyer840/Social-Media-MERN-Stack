

export enum ErrorType {
    UserNotFound = "UserNotFound",
    InvalidCredentials = "InvalidCredentials",
    ServerError = "ServerError",
    // ... other error types
}

export const ErrorMessages: { [key in ErrorType]: string } = {
    [ErrorType.UserNotFound]: "User does not exist.",
    [ErrorType.InvalidCredentials]: "Invalid credentials.",
    [ErrorType.ServerError]: "Something went wrong on the server.",
    // ... other error messages
};
