import type { Request, Response, NextFunction } from "express"
import type { ZodSchema } from "zod"

export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            return next(result.error)
        }
        req.body = result.data
        next()
    }
}
