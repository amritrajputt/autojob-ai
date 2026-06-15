import type { Request, Response } from "express";
import UsersService from "./users.service.js";
import { getAuth } from "@clerk/express";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";

class UsersController {
    static async getMe(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }

        const user = await UsersService.getMe(userId);
        return ApiResponse.success(res, "User fetched successfully", user);
    }

    static async updateMe(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }

        const { name } = req.body;

        const updatedUser = await UsersService.updateMe(userId, name);
        
        return ApiResponse.success(res, "User updated successfully", updatedUser);
    }

    static async getActivePlan(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }

        const planDetails = await UsersService.getActivePlan(userId);
        return ApiResponse.success(res, "Active plan fetched successfully", planDetails);
    }
}

export { UsersController };
