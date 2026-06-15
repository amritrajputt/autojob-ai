import db from "../../index.js";
import { resumeTable, usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../../common/utils/ApiError.js";
import { supabase } from "../../common/utils/supabase.js"

class ResumeService {
    static async uploadResume(userId: string, file: Express.Multer.File, label: string) {
        const existingResumes = await db
            .select()
            .from(resumeTable)
            .where(eq(resumeTable.userId, userId));
        if (existingResumes.length >= 3) {
            throw ApiError.badRequest("You can only upload 3 resumes");
        }

        const filePath = `resumes/${userId}/${Date.now()}-${file.originalname}`;
        const { data: fileData, error: fileError } = await supabase.storage
            .from("resumes")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "max-age=31536000, public",
            });
        if (fileError) {
            throw ApiError.badRequest(fileError.message);
        }

        const { data: { publicUrl } } = supabase.storage
            .from("resumes")
            .getPublicUrl(filePath);

        const resume = await db
            .insert(resumeTable)
            .values({
                userId,
                size: file.size,
                resumeFileType: file.mimetype,
                resumeUrl: publicUrl,
                label,
            })
            .returning();
        return resume[0];
    }

    static async getResumes(userId: string) {
        return await db
            .select()
            .from(resumeTable)
            .where(eq(resumeTable.userId, userId));
    }

    static async deleteResume(id: string) {
        const resume = await db
            .select()
            .from(resumeTable)
            .where(eq(resumeTable.id, id))
            .limit(1);
        if (!resume[0]) {
            throw ApiError.notFound("Resume not found");
        }

        const urlParts = resume[0].resumeUrl.split("/resumes/");
        const filePath = urlParts[1];
        
        if (filePath) {
            await supabase.storage.from("resumes").remove([filePath]);
        }

        await db.delete(resumeTable).where(eq(resumeTable.id, id));
    }

    static async updateResumeLabels(id: string, label: string) {
        const resume = await db
            .update(resumeTable)
            .set({ label })
            .where(eq(resumeTable.id, id))
            .returning();
        if (!resume[0]) {
            throw ApiError.notFound("Resume not found");
        }
        return resume[0];
    }
}
export { ResumeService };