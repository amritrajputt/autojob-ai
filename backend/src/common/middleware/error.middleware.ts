import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/ApiError.js"

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: null,
        })
    }

    // Unknown errors — 500
    console.error("Unhandled error:", err)
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
    })
}