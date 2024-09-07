import { beforeAll, afterAll } from 'vitest'
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

let viteServer: any

beforeAll(async () => {
  viteServer = await createServer({
    root: __dirname,
    configFile: "vite.config.ts",
  })
  await viteServer.listen()
})

afterAll(async () => {
  await viteServer.close()
})
