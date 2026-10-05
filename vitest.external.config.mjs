import { defineConfig } from 'vitest/config'

// Same as vitest.config.mjs, plus lib.mjs is externalized so b.external.test.mjs
// loads it natively instead of through the module runner.
export default defineConfig({
  test: {
    pool: 'forks',
    server: {
      deps: {
        external: [/lib\.mjs$/],
      },
    },
    coverage: {
      provider: 'v8',
      include: ['lib.mjs'],
      reporter: ['json', 'text'],
    },
  },
})
