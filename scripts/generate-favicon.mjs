/**
 * Build favicon assets from logo-igo.svg (horizontal mirror, same as UI).
 * Run: npm run generate:favicon
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const input = join(publicDir, 'logo-igo.svg')

const sizes = [32, 180]

for (const size of sizes) {
  const buffer = await sharp(input).flop().resize(size, size).png().toBuffer()
  const name = size === 32 ? 'favicon.png' : 'apple-touch-icon.png'
  writeFileSync(join(publicDir, name), buffer)
  console.log(`wrote ${name} (${size}x${size})`)
}

const favicon32 = readFileSync(join(publicDir, 'favicon.png'))
const b64 = favicon32.toString('base64')
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
  <image width="32" height="32" xlink:href="data:image/png;base64,${b64}"/>
</svg>
`
writeFileSync(join(publicDir, 'favicon.svg'), faviconSvg)
console.log('wrote favicon.svg (embedded PNG)')
