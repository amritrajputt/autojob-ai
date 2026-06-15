import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import UserPreferenceService from "./userPreference.service.js";

class UserPreferenceController {
    static async createPreference(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const preference = await UserPreferenceService.createPreference(userId, req.body);
        return ApiResponse.success(res, "Preference created successfully", preference);
    }

    static async updateUserPreferences(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const preference = await UserPreferenceService.updateUserPreferences(userId, req.body);
        return ApiResponse.success(res, "Preference updated successfully", preference);
    }

    static async getUserPreferences(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const preference = await UserPreferenceService.getUserPreferences(userId);
        return ApiResponse.success(res, "Preference fetched successfully", preference);
    }
}

export { UserPreferenceController }