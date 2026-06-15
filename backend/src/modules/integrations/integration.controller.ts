import type { Request, Response } from "express";
import { platformEnum, platformParamSchema, groqKeySchema, cookieSchema } from "./integrations.dto.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { encrypt } from "./encryption.js";
import { getAuth } from "@clerk/express";
import { IntegrationService } from "./integration.service.js";

class IntegrationController {
    static async groqIntegration(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }

        const { groqApiKey } = req.body;
        const integration = await IntegrationService.groqIntegration(userId, groqApiKey);
        return ApiResponse.success(res, "Groq integration added successfully", integration);
    }

    static async getIntegrations(req: Request, res: Response) {
      
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const integrations = await IntegrationService.getIntegrations(userId);
        return ApiResponse.success(res, "Integrations fetched successfully", integrations);
    }

    static async deleteGroq(req: Request, res: Response) {
     
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const integration = await IntegrationService.deleteGroq(userId);
        return ApiResponse.success(res, "Groq integration deleted successfully", integration);
    }

    static async addCookie(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const platform = req.params.platform as string;
        const { cookie } = req.body;
        const integration = await IntegrationService.addCookie(userId, platform, cookie);
        return ApiResponse.success(res, "Cookie added successfully", integration);
    }

    static async getCookie(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const platform = req.params.platform as string;
        const integration = await IntegrationService.getCookie(userId, platform);
        return ApiResponse.success(res, "Cookie fetched successfully", integration);
    }

    static async deleteCookie(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const platform = req.params.platform as string;
        const integration = await IntegrationService.deleteCookie(userId, platform);
        return ApiResponse.success(res, "Cookie deleted successfully", integration);
    }

    static async getCookieStatus(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const platform = req.params.platform as string;
        const integration = await IntegrationService.getCookieStatus(userId, platform);
        return ApiResponse.success(res, "Cookie status fetched successfully", integration);
    }
}

export { IntegrationController };