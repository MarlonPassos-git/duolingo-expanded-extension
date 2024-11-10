import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'unit',
    include: ['**/*.unit.spec.ts'],
    environment: 'happy-dom',
    setupFiles: ['./test.setup.unit.ts'],
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
