class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: any, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = true;
    }

    static ok(data: any, message: string = "Success") {
        return new ApiResponse(200, data, message);
    }

    static created(data: any, message: string = "Resource created successfully") {
        return new ApiResponse(201, data, message);
    }

    static noContent(message: string = "No content") {
        return new ApiResponse(204, null, message);
    }
}

export { ApiResponse };