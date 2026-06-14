import dotenv from "dotenv"
dotenv.config()                        // ← SABSE PEHLE

import { createServer } from "http"
import { clerkMiddleware, clerkClient, getAuth } from "@clerk/express"
import express from "express"
import cors from "cors"
import helmet from "helmet"

import { errorMiddleware } from "./common/middleware/error.middleware.js"
import { authMiddleware } from "./common/middleware/auth.middleware.js"
import { webhookRouter } from "./modules/webhook/webhook.routes.js"
import { usersRouter } from "./modules/users/users.routes.js"

async function main() {
    const app = express()
    const server = createServer(app)

   
    app.use(helmet())
    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    }))

    app.use("/webhooks", express.raw({ type: "application/json" }), webhookRouter)

    
    app.use(clerkMiddleware())

 
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use("/api/users", usersRouter)

    app.get("/health", (req, res) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() })
    })

 
    app.get("/protected", authMiddleware, async (req, res, next) => {
        try {
            const { userId } = getAuth(req)     
            const user = await clerkClient.users.getUser(userId!)  
            return res.json({ user })
        } catch (error) {
            next(error)
        }
    })

    app.use(errorMiddleware)

    const PORT = process.env.PORT || 5000
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
        console.log(`Health: http://localhost:${PORT}/health`)
    })
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})