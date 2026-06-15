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
        // TODO: Implement getIntegrations
    }

    static async deleteGroq(req: Request, res: Response) {
        // TODO: Implement deleteGroq
    }

    static async addCookie(req: Request, res: Response) {
        // TODO: Implement addCookie
    }

    static async getCookie(req: Request, res: Response) {
        // TODO: Implement getCookie
    }

    static async deleteCookie(req: Request, res: Response) {
        // TODO: Implement deleteCookie
    }

    static async getCookieStatus(req: Request, res: Response) {
        // TODO: Implement getCookieStatus
    }
}

export { IntegrationController };