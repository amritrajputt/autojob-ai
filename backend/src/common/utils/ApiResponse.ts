class ApiResponse<T> {
    data: T | null;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: T | null, message: string = "Success") {
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

    static success<T>(res: any, message: string, data: T | null = null, statusCode = 200) {
        return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
    }

    static error(res: any, message: string, statusCode = 500) {
        return res.status(statusCode).json(new ApiResponse(statusCode, null, message));
    }
    
    static ok<T>(data: T, message: string = "Success") {
        return new ApiResponse(200, data, message);
    }

    static created<T>(data: T, message: string = "Resource created successfully") {
        return new ApiResponse(201, data, message);
    }

    static noContent(message: string = "No content") {
        return new ApiResponse(204, null, message);
    }
}

export { ApiResponse };