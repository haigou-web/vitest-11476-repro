import { expect, test } from 'vitest'

// Loads the same lib.mjs natively, bypassing the module runner.
// vitest.external.config.mjs externalizes lib.mjs so this import is handled by Node.
test('loads lib.mjs natively via server.deps.external', async () => {
  const url = new URL('./lib.mjs', import.meta.url).href
  const mod = await import(/* @vite-ignore */ url)
  expect(typeof mod.outer).toBe('function')
})
