/**
 * 为 CloudBase 临时图片地址追加按展示尺寸处理参数。
 * 已带查询参数的地址使用 & 连接，避免破坏签名或现有参数。
 */
export function imgUrl(url, width) {
  if (!url || !width) return url || ''
  const separator = String(url).includes('?') ? '&' : '?'
  return `${url}${separator}imageMogr2/thumbnail/${Math.max(1, Math.round(width))}x/format/webp/quality/80`
}
