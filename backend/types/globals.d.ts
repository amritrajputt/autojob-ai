/// <reference types="@clerk/express/env" />
declare namespace Express {
    interface Request {
        auth?: {
            userId: string
            sessionId: string
            sessionClaims?: Record<string, unknown>
        }
    }
}
export {}