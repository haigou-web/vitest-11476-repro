import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',
    coverage: {
      provider: 'v8',
      include: ['lib.mjs'],
      reporter: ['json', 'text'],
    },
  },
})
