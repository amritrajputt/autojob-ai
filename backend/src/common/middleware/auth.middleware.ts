import type { Request, Response, NextFunction } from "express";
import { getAuth ,clerkClient} from "@clerk/express"
import {ApiError} from "../utils/ApiError.js"

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            throw ApiError.unAuthorized("Unauthorized")
        }
        
        next()

    } catch (error) {
      next(error)
    }
    
}
export { authMiddleware }