import { defineConfig } from 'vitest/config'

const TEN_MINUTE_IN_MS = 60_000 * 10

export default defineConfig({
  test: {
    hookTimeout: TEN_MINUTE_IN_MS,
    name: 'e2e',
    setupFiles: './test.setup.ts',
    testTimeout: TEN_MINUTE_IN_MS,
    poolOptions: {
      forks: {
        execArgv: ['--env-file=.env.test'],
        singleFork: true,
      },
    },
    maxConcurrency: 1,
    fileParallelism: false,
  },
})
