# vitest #11476 — minimal reproduction

Minimal, runnable reproduction for
[vitest-dev/vitest#11476](https://github.com/vitest-dev/vitest/issues/11476):

> coverage-v8: counts zeroed (or negative) when a covered module is also imported
> natively in another test file

## Why this exists

The steps in the issue use `new Function('url', 'return import(url)')` to load the module
natively. That cannot work: `new Function` bodies are compiled inside Vitest's `node:vm`
context, and a dynamic `import()` from a vm script requires `importModuleDynamically` to be
provided by the host. The result is

```
TypeError: A dynamic import callback was not specified.
```

so the reproduction never reaches coverage at all.

This repo expresses the same condition — "the module is also loaded natively, not through the
module runner" — using Vitest's supported `server.deps.external` option instead. It reproduces
deterministically.

## Environment used

- Windows 11 (`win32 x64`)
- Node v24.18.0
- vitest 5.0.3 / @vitest/coverage-v8 5.0.3

## Run

```bash
npm install --include=dev

# 1. baseline — only the module runner loads lib.mjs. Counts are correct.
npm run repro:baseline
node print-counts.mjs

# 2. bug — the module runner AND a native load of the same file. Counts are broken.
npm run repro:bug
node print-counts.mjs
```

> `--include=dev` is needed if your environment has `NODE_ENV=production`, otherwise npm
> defaults to `omit=dev` and installs nothing for this devDependency-only project.

## Observed result

Both runs pass their tests. Only the coverage numbers differ.

**Baseline (`a.test.mjs` alone) — correct:**

```
s = {"0":6,"1":0,"2":6,"3":6,"4":0,"5":6} (total 24)
f = {"0":6,"1":6} (total 12)
b = {"0":[0,6],"1":[0,6]} (total 12)
```

**Bug (`a.test.mjs` + `b.external.test.mjs`) — broken:**

```
s = {"0":0,"1":6,"2":0,"3":0,"4":0,"5":0} (total 6)
f = {"0":0,"1":0} (total 0)
b = {"0":[6,-6],"1":[0,0]} (total 0)
```

Three symptoms, all matching the report:

1. **Function counts zeroed** — `f` is `{0, 0}` although `outer` ran six times.
2. **Hit count on a statement that never executed** — the only non-zero entry is statement `1`
   (`return -value`, inside the untaken `value < 0` branch) and it carries the count `6` that
   belongs to `outer`. Statements `0`, `2`, `3`, `5` — which did execute — are `0`.
3. **Negative branch count** — `b[0] = [6, -6]`, the same shape as the `[1237, -1237]`
   reported in the issue.

Stable across repeated runs (3/3 identical), so it is not a race.

## Minimal trigger

The same module must be loaded **both** through the module runner (from one test file) **and**
natively (from another). Either load alone produces correct counts.

Note: loading natively via `createRequire(import.meta.url)('./lib.mjs')` does **not** trigger
the bug — the externalized-import path is required.
