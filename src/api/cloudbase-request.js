import { callCloudFunction } from '../platform/cloudbase.js'

function splitUrl(url) {
  const [path, search = ''] = url.split('?')
  return { path, query: Object.fromEntries(new URLSearchParams(search)) }
}

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
