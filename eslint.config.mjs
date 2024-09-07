import config from '@repo/eslint-config'

export default [
  {
    ignores: ['node_modules', 'dist'],

  },
  ...config,
]
