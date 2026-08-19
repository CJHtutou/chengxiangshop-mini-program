import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const appId = process.argv[2]

if (!/^wx[a-zA-Z0-9]{16}$/.test(appId || '')) {
  console.error('用法：npm run configure:appid -- wx1234567890abcdef')
  process.exit(1)
}

const manifestUrl = new URL('../src/manifest.json', import.meta.url)
const manifest = JSON.parse(await readFile(fileURLToPath(manifestUrl), 'utf8'))
manifest['mp-weixin'].appid = appId
await writeFile(fileURLToPath(manifestUrl), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.info(`微信小程序 AppID 已更新为 ${appId}`)
