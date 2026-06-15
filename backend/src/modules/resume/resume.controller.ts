import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ResumeService } from "./resume.service.js";

class ResumeController {
    static async uploadResume(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        if (!req.file || !req.file.originalname) {
            throw ApiError.badRequest("No file uploaded");
        }
        const file = req.file;
        const { label } = req.body;
        const resume = await ResumeService.uploadResume(userId, file, label);
        return ApiResponse.success(res, "Resume uploaded successfully", resume);
    }


    static async getResumes(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const resumes = await ResumeService.getResumes(userId);
        return ApiResponse.success(res, "Resumes fetched successfully", resumes);
    }


    static async deleteResume(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            throw ApiError.badRequest("Invalid id");
        }
        await ResumeService.deleteResume(id);
        return ApiResponse.success(res, "Resume deleted successfully");
    }


    static async updateResumeLabels(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) {
            throw ApiError.unAuthorized("User not authorized");
        }
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            throw ApiError.badRequest("Invalid id");
        }
        const { label } = req.body;
        await ResumeService.updateResumeLabels(id, label);
        return ApiResponse.success(res, "Labels updated successfully");
    }
}


export { ResumeController };