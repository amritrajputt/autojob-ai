import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/ApiError.js"
import { ZodError } from "zod"

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors && err.errors.length > 0 ? err.errors : undefined,
            data: null,
        })
    }

    // 2. Zod validation error
    if (err instanceof ZodError) {
        const validationErrors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }))
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationErrors,
            data: null,
        })
    }

    // 3. Database unique constraint or other Drizzle database errors
    if (err && typeof err === 'object' && 'code' in err) {
        const pgError = err as { code: string; detail?: string; message?: string };
        if (pgError.code === "23505") {
            return res.status(409).json({
                success: false,
                message: pgError.detail || "Resource already exists",
                data: null,
            })
        }
        if (pgError.code === "23503") {
            return res.status(400).json({
                success: false,
                message: pgError.detail || "Referenced resource does not exist",
                data: null,
            })
        }
    }

    // 4. Unknown/Unhandled server errors
    console.error("Unhandled error:", err)

    const isProduction = process.env.NODE_ENV === "production"
    return res.status(500).json({
        success: false,
        message: isProduction ? "Internal server error" : err.message || "Internal server error",
        errors: isProduction ? undefined : [err.stack || err],
        data: null,
    })
}