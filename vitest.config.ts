import { defineConfig } from 'vitest/config'

const TEN_MINUTE_IN_MS = 60_000 * 10

export default defineConfig({
  test: {
    name: 'e2e',
    setupFiles: './test.setup.ts',
    testTimeout: TEN_MINUTE_IN_MS,
    poolOptions: {
      forks: {
        execArgv: ['--env-file=.env.test'],
      },
    },
  },
})
