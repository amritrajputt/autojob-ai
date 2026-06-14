import db from "../../index.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";

class WebhookService {
    static async createUser(data: any) {
        const email = data.email_addresses?.[0]?.email_address;
        if (!email) {
            throw new Error("No email address provided in webhook data");
        }

        const firstName = data.first_name || "";
        const lastName = data.last_name || "";
        const name = `${firstName} ${lastName}`.trim();

        await db.insert(usersTable).values({
            id: data.id,
            name: name || null,
            email: email,
            currentPlan: "free",
            isActive: true,
            isDeleted: false,
        }).onConflictDoUpdate({
            target: usersTable.id,
            set: {
                name: name || null,
                email: email,
                isActive: true,
                isDeleted: false,
                updatedAt: new Date()
            }
        });
    }

    static async updateUser(data: any) {
        const email = data.email_addresses?.[0]?.email_address;
        const firstName = data.first_name || "";
        const lastName = data.last_name || "";
        const name = `${firstName} ${lastName}`.trim();

        await db.update(usersTable)
            .set({
                name: name || null,
                email: email,
                updatedAt: new Date()
            })
            .where(eq(usersTable.id, data.id));
    }

    static async deleteUser(data: any) {
        await db.update(usersTable)
            .set({
                isDeleted: true,
                isActive: false,
                updatedAt: new Date()
            })
            .where(eq(usersTable.id, data.id));
    }
}

export {WebhookService}