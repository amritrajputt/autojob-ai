import { z } from "zod";

const allQualifications = {
    "10th": "10th",
    "12th": "12th",
    "Bachelor's Degree": ["B.Tech", "B.E", "BCA", "BBA", "B.Sc", "B.Pharm", "BS"],
    "Master's Degree": ["M.Tech", "M.E", "MCA", "MBA", "M.Sc", "M.Pharm", "MS"],
    "Diploma": ["Diploma in Electronics Engineering", "Diploma in Electrical Engineering", "Diploma in Mechanical Engineering", "Diploma in Civil Engineering", "Diploma in Computer Science Engineering", "Diploma in Information Technology", "Diploma in Chemical Engineering", "Diploma in Biotechnology Engineering"]
} as const;

const allowedQualifications = [
    "10th",
    "12th",
    "Bachelor's Degree",
    "Master's Degree",
    "Diploma",
    ...allQualifications["Bachelor's Degree"],
    ...allQualifications["Master's Degree"],
    ...allQualifications["Diploma"]
] as const;

const jobTypeEnum = z.enum(["full_time", "internship"]);
const workModelEnum = z.enum(["onsite", "remote", "hybrid"]);

const userPreferenceSchema = z.object({
    preferredLocation: z.array(z.string()).min(1, "At least one location is required"),
    qualifications: z.array(z.enum(allowedQualifications)).min(1, "At least one qualification is required"),
    skills: z.array(z.string()).min(5, "At least 5 skills are required").max(10, "At most 10 skills are allowed"),
    preferredDomain: z.array(z.string()).min(1, "At least one preferred domain is required"),
    preferredJobType: z.array(jobTypeEnum).min(1, "At least one job type is required"),
    preferredWorkModel: z.array(workModelEnum).min(1, "At least one work model is required"),
    minExperience: z.number().int().min(0).default(0),
    maxExperience: z.number().int().min(0).default(0),
    minExpectedSalary: z.number().int().min(0).default(0),
    maxExpectedSalary: z.number().int().min(0).default(0)
});

const updateUserPreferenceSchema = userPreferenceSchema.partial();

export { userPreferenceSchema, updateUserPreferenceSchema };
