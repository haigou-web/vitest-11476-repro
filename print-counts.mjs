// Prints the s/f/b maps for lib.mjs from coverage/coverage-final.json
import { readFileSync } from 'node:fs'

const j = JSON.parse(readFileSync('coverage/coverage-final.json', 'utf8'))
const key = Object.keys(j).find((k) => k.replace(/\\/g, '/').endsWith('lib.mjs'))
if (!key) {
  console.log('lib.mjs not present in the coverage report')
  process.exit(1)
}
const { s, f, b } = j[key]
const tot = (o) => Object.values(o).reduce((a, v) => a + v, 0)
const btot = (o) => Object.values(o).flat().reduce((a, v) => a + v, 0)
console.log('s =', JSON.stringify(s), '(total', tot(s) + ')')
console.log('f =', JSON.stringify(f), '(total', tot(f) + ')')
console.log('b =', JSON.stringify(b), '(total', btot(b) + ')')
