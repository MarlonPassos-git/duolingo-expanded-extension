import { z } from 'zod'

const envSchema = z.object({
  DUOLINGO_JWT_TOKEN: z.string(),
  CHROME_PATH: z.string().optional(),
  HEADLESS: z.enum(['true', 'false']).transform(value => value === 'true').default('true'),
})
export function getEnv() {
  return envSchema.parse(process.env)
}
