import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.unit.ts',
  },
  {
    extends: './vitest.config.e2e.ts',
    test: {

    },
  },
])
