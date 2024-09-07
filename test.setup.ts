import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import type { ViteDevServer } from 'vite'
import { afterAll, beforeAll } from 'vitest'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

let viteServer: ViteDevServer

beforeAll(async () => {
  viteServer = await createServer({
    root: __dirname,
    configFile: 'vite.config.ts',
  })
  await viteServer.listen()
})

afterAll(async () => {
  await viteServer.close()
})
