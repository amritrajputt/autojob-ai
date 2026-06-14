class ApiError extends Error {
    statusCode: number;
    success: boolean;
    errors: any[];


    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = "",
      
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static unAuthorized(message: string) {
        return new ApiError(401, message, [], "");
    }

    static badRequest(message: string) {
        return new ApiError(400, message, [], "");
    }

    static notFound(message: string) {
        return new ApiError(404, message, [], "");
    }

    static internalServerError(message: string) {
        return new ApiError(500, message, [], "");
    }

    static forbidden(message: string) {
        return new ApiError(403, message, [], "");
    }
}

export { ApiError };

