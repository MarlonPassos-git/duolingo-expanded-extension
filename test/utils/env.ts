import { loadEnv } from 'vite'
import { z } from 'zod'

const envSchema = z.object({
  VITE_DUOLINGO_JWT_TOKEN: z.string(),
  VITE_CHROME_PATH: z.string().optional(),
  VITE_HEADLESS: z.enum(['true', 'false']).transform(value => value === 'true').default('true'),
})

export function getEnv() {
  const envs = loadEnv('test', `${process.cwd()}`)

  return envSchema.parse(envs)
}
