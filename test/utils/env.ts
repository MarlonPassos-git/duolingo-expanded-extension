import { z } from "zod"

export function getEnv() {
    const envSchema = z.object({
        DUOLINGO_JWT_TOKEN: z.string(),
    })
    
    return envSchema.parse(process.env)
}