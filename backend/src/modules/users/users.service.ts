import db from "../../index.js";
import { usersTable, subscriptionsTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../../common/utils/ApiError.js";

class UsersService {
    static async getMe(userId: string) {

        const data = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId))
            .limit(1);

        if (data.length === 0) {
            throw ApiError.notFound("User not found");
        }

        return data[0];
    }

    static async updateMe(userId: string, name: string) {
        const updated = await db
            .update(usersTable)
            .set({
                name,
                updatedAt: new Date()
            })
            .where(eq(usersTable.id, userId))
            .returning();

        if (updated.length === 0) {
            throw ApiError.notFound("User not found");
        }

        return updated[0];
    }

    static async getActivePlan(userId: string) {
        const data = await db
            .select({
                currentPlan: usersTable.currentPlan,
                planStatus: subscriptionsTable.planStatus,
                trialStartTime: subscriptionsTable.trialStartTime,
                trialEndTime: subscriptionsTable.trialEndTime,
                trialEmailsUsed: subscriptionsTable.trialEmailsUsed,
                currentSubscriptionStartDate: subscriptionsTable.currentSubscriptionStartDate,
                currentSubscriptionEndDate: subscriptionsTable.currentSubscriptionEndDate
            })
            .from(usersTable)
            .leftJoin(subscriptionsTable, eq(usersTable.id, subscriptionsTable.userId))
            .where(eq(usersTable.id, userId))
            .limit(1);

        if (data.length === 0) {
            throw ApiError.notFound("User not found");
        }

        return data[0]!;
    }
}

export default UsersService;
