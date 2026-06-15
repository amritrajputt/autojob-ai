import db from "../../index.js";
import { userPreferencesTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../../common/utils/ApiError.js";
import { z } from "zod";
import { userPreferenceSchema, updateUserPreferenceSchema } from "./userPreference.dto.js";

type CreateUserPreferenceInput = z.infer<typeof userPreferenceSchema>;
type UpdateUserPreferenceInput = z.infer<typeof updateUserPreferenceSchema>;

class UserPreferenceService {
    static async createPreference(userId: string, data: CreateUserPreferenceInput) {
        const existingPreferences = await db
            .select()
            .from(userPreferencesTable)
            .where(eq(userPreferencesTable.userId, userId));

        if (existingPreferences.length > 0) {
            throw ApiError.badRequest("You can only have one preference");
        }

        const preference = await db
            .insert(userPreferencesTable)
            .values({
                userId,
                ...data
            })
            .returning();

        return preference[0];
    }

    static async updateUserPreferences(userId: string, data: UpdateUserPreferenceInput) {
        const preference = await db
            .update(userPreferencesTable)
            .set(data)
            .where(eq(userPreferencesTable.userId, userId))
            .returning();

        if (!preference[0]) {
            throw ApiError.notFound("Preference not found");
        }

        return preference[0];
    }

    static async getUserPreferences(userId: string) {
        const preference = await db
            .select()
            .from(userPreferencesTable)
            .where(eq(userPreferencesTable.userId, userId))
            .limit(1);

        if (!preference[0]) {
            throw ApiError.notFound("Preference not found");
        }

        return preference[0];
    }
}

export default UserPreferenceService;