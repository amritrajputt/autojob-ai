import db from "../../index.js"
import { integrationsTable } from "../../db/schema.js"
import { eq } from "drizzle-orm"
import { encrypt } from "./encryption.js"
import { ApiError } from "../../common/utils/ApiError.js"

class IntegrationService {
    static async groqIntegration(userId: string, groqApiKey: string) {
        const existing = await db
            .select()
            .from(integrationsTable)
            .where(eq(integrationsTable.userId, userId))
            .limit(1);

        if (existing[0]?.groqApiKey) {
            throw ApiError.badRequest("Integration already exists");
        }

        const encryptedApiKey = encrypt(groqApiKey);
        const createdIntegration = await db
            .insert(integrationsTable)
            .values({
                userId,
                groqApiKey: encryptedApiKey,
            })
            .onConflictDoUpdate({
                target: integrationsTable.userId,
                set: {
                    groqApiKey: encryptedApiKey,
                    updatedAt: new Date(),
                }
            })
            .returning();

        return createdIntegration[0];
    }

    static async getIntegrations(userId: string) {
        const integrations = await db
            .select()
            .from(integrationsTable)
            .where(eq(integrationsTable.userId, userId))
            .limit(1);

        return integrations[0];
    }

    static async deleteGroq(userId: string) {
        const updated = await db
            .update(integrationsTable)
            .set({
                groqApiKey: null,
                updatedAt: new Date(),
            })
            .where(eq(integrationsTable.userId, userId))
            .returning();

        return updated[0];
    }

    static async addCookie(userId: string, platform: string, cookie: string) {
        let cookieField: "linkedinCookie" | "naukriCookie" | "internshalaCookie";
        let statusField: "linkedinCookieStatus" | "naukriCookieStatus" | "internshalaCookieStatus";
        if (platform === "linkedin") {
            cookieField = "linkedinCookie";
            statusField = "linkedinCookieStatus";
        } else if (platform === "naukri") {
            cookieField = "naukriCookie";
            statusField = "naukriCookieStatus";
        } else if (platform === "internshala") {
            cookieField = "internshalaCookie";
            statusField = "internshalaCookieStatus";
        } else {
            throw ApiError.badRequest("Invalid platform");
        }

        const existing = await db
            .select()
            .from(integrationsTable)
            .where(eq(integrationsTable.userId, userId))
            .limit(1);

        if (existing[0]?.[cookieField]) {
            throw ApiError.badRequest(`${platform} cookie already exists`);
        }

        const encryptedCookie = encrypt(cookie);
        const createdIntegration = await db
            .insert(integrationsTable)
            .values({
                userId,
                [cookieField]: encryptedCookie,
                [statusField]: "active",
            })
            .onConflictDoUpdate({
                target: integrationsTable.userId,
                set: {
                    [cookieField]: encryptedCookie,
                    [statusField]: "active",
                    updatedAt: new Date(),
                }
            })
            .returning();

        return createdIntegration[0];
    }

    static async getCookie(userId: string, platform: string) {
        let cookieField: "linkedinCookie" | "naukriCookie" | "internshalaCookie";
        if (platform === "linkedin") {
            cookieField = "linkedinCookie";
        } else if (platform === "naukri") {
            cookieField = "naukriCookie";
        } else if (platform === "internshala") {
            cookieField = "internshalaCookie";
        } else {
            throw ApiError.badRequest("Invalid platform");
        }

        const data = await db
            .select()
            .from(integrationsTable)
            .where(eq(integrationsTable.userId, userId))
            .limit(1);

        if (!data[0] || !data[0][cookieField]) {
            throw ApiError.notFound(`${platform} cookie not found`);
        }

        return data[0];
    }

    static async deleteCookie(userId: string, platform: string) {
        let cookieField: "linkedinCookie" | "naukriCookie" | "internshalaCookie";
        let statusField: "linkedinCookieStatus" | "naukriCookieStatus" | "internshalaCookieStatus";
        if (platform === "linkedin") {
            cookieField = "linkedinCookie";
            statusField = "linkedinCookieStatus";
        } else if (platform === "naukri") {
            cookieField = "naukriCookie";
            statusField = "naukriCookieStatus";
        } else if (platform === "internshala") {
            cookieField = "internshalaCookie";
            statusField = "internshalaCookieStatus";
        } else {
            throw ApiError.badRequest("Invalid platform");
        }

        const updated = await db
            .update(integrationsTable)
            .set({
                [cookieField]: null,
                [statusField]: "not_set",
                updatedAt: new Date(),
            })
            .where(eq(integrationsTable.userId, userId))
            .returning();

        return updated[0];
    }

    static async getCookieStatus(userId: string, platform: string) {
        let cookieField: "linkedinCookie" | "naukriCookie" | "internshalaCookie";
        let statusField: "linkedinCookieStatus" | "naukriCookieStatus" | "internshalaCookieStatus";
        if (platform === "linkedin") {
            cookieField = "linkedinCookie";
            statusField = "linkedinCookieStatus";
        } else if (platform === "naukri") {
            cookieField = "naukriCookie";
            statusField = "naukriCookieStatus";
        } else if (platform === "internshala") {
            cookieField = "internshalaCookie";
            statusField = "internshalaCookieStatus";
        } else {
            throw ApiError.badRequest("Invalid platform");
        }

        const data = await db
            .select()
            .from(integrationsTable)
            .where(eq(integrationsTable.userId, userId))
            .limit(1);

        if (!data[0] || !data[0][cookieField]) {
            return { status: "not_set" };
        }

        return { status: data[0][statusField] || "active" };
    }
    
}
export { IntegrationService }