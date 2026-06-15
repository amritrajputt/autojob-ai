import db from "../../index.js"
import { integrationsTable } from "../../db/schema.js"
import { eq } from "drizzle-orm"
import { encrypt } from "./encryption.js"
import { ApiError } from "../../common/utils/ApiError.js"

class IntegrationService {
    static async groqIntegration(userId: string, groqApiKey: string) {
        const groqApiKeyInDb = await db
            .select()
            .from(integrationsTable)
            .where(eq(integrationsTable.userId, userId))
            .limit(1);

        if (groqApiKeyInDb.length > 0) {
            throw ApiError.badRequest("Integration already exists");
        }

        const encryptedApiKey = encrypt(groqApiKey);
        const createdIntegration = await db
            .insert(integrationsTable)
            .values({
                userId,
                groqApiKey: encryptedApiKey,
            })
            .returning();

        return createdIntegration[0];
    }
}
export { IntegrationService }