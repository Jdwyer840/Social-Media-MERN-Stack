export var ErrorType;
(function (ErrorType) {
    ErrorType["UserNotFound"] = "UserNotFound";
    ErrorType["InvalidCredentials"] = "InvalidCredentials";
    ErrorType["ServerError"] = "ServerError";
    // ... other error types
})(ErrorType || (ErrorType = {}));
export const ErrorMessages = {
    [ErrorType.UserNotFound]: "User does not exist.",
    [ErrorType.InvalidCredentials]: "Invalid credentials.",
    [ErrorType.ServerError]: "Something went wrong on the server.",
    // ... other error messages
};
