import { callCloudFunction } from '../platform/cloudbase.js'

function decode(value) {
  return decodeURIComponent(value.replace(/\+/g, ' '))
}

function splitUrl(url) {
  const [path, search = ''] = url.split('?')
  const query = {}
  for (const pair of search.split('&')) {
    if (!pair) continue
    const separator = pair.indexOf('=')
    const key = separator < 0 ? pair : pair.slice(0, separator)
    const value = separator < 0 ? '' : pair.slice(separator + 1)
    query[decode(key)] = decode(value)
  }
  return { path, query }
}

/**
 * 将 REST 风格请求适配为统一云函数调用。
 *
 * 前端不会在这里决定用户身份；云函数从 OPENID 解析用户。失败响应被转换为 Error
 * 并保留 requestId，页面可展示友好错误，运维可用 requestId 关联云函数日志。
 *
 * @param {{url: string, method?: string, data?: object, timeout?: number}} options 请求参数
 * @returns {Promise<object>} 成功的统一响应
 */
export async function cloudbaseRequest({ url, method = 'GET', data, timeout = 12000 }) {
  const { path, query } = splitUrl(url)
  const response = await callCloudFunction({ path, method, query, body: data || {} }, timeout)
  if (!response || response.code !== 200) {
    const error = new Error(response?.message || '云函数请求失败')
    error.details = response?.errors || []
    error.requestId = response?.requestId
    throw error
  }
  return response
}
