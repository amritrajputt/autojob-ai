import { z } from "zod";

export const resumeSchema = z.object({
    label: z.string().min(2, "Label must be at least 2 characters long").max(100, "Label must be at most 100 characters long")
})

export const updateResumeSchema = z.object({
    label: z.string().min(2, "Label must be at least 2 characters long").max(100, "Label must be at most 100 characters long")
})

export type ResumeUploadDto = z.infer<typeof resumeSchema>
export type UpdateResumeDto = z.infer<typeof updateResumeSchema>