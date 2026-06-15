import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv"
dotenv.config()
// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
})

export { supabase }