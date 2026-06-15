import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { userPreferenceSchema, updateUserPreferenceSchema } from "./userPreference.dto.js";
import UserPreferenceService from "./userPreference.service.js";

class UserPreferenceController {
    static async createPreference(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const parsed = userPreferenceSchema.safeParse(req.body);
        if (!parsed.success) {
            throw ApiError.badRequest(parsed.error.issues[0]?.message || "Invalid input data");
        }
        const preference = await UserPreferenceService.createPreference(userId, parsed.data);
        return ApiResponse.success(res, "Preference created successfully", preference);
    }

    static async updateUserPreferences(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const parsed = updateUserPreferenceSchema.safeParse(req.body);
        if (!parsed.success) {
            throw ApiError.badRequest(parsed.error.issues[0]?.message || "Invalid input data");
        }
        const preference = await UserPreferenceService.updateUserPreferences(userId, parsed.data);
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