import { createClerkClient } from '@clerk/express'
import dotenv from 'dotenv'
dotenv.config()

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

const userList = await clerkClient.users.getUserList()