import { z } from "zod";

const platformEnum = z.enum(["linkedin", "naukri", "internshala"], {
    message: "Platform must be linkedin, naukri, or internshala"
});

const platformParamSchema = z.object({
    platform: platformEnum
});

const groqKeySchema = z.object({
    groqApiKey: z.string().startsWith("gsk_").min(20, "minimum 20 characters required").max(200, "maximum 200 characters required")
});

const cookieSchema = z.object({
    cookie: z.string().min(10, "minimum 10 characters required").max(5000, "maximum 5000 characters required")
});

export { platformEnum, platformParamSchema, groqKeySchema, cookieSchema }