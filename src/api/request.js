const MODE = import.meta.env.VITE_DATA_MODE || (import.meta.env.DEV ? 'mock' : 'api')
const BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const ACCESS_KEY = 'chengxiang-user-access-token'
if (import.meta.env.PROD && (MODE !== 'api' || !BASE_URL)) throw new Error('生产环境必须设置 VITE_DATA_MODE=api 和 VITE_API_BASE_URL，禁止回退 Mock')
export const isMockMode = MODE === 'mock'
export const tokenStore = { get: () => uni.getStorageSync(ACCESS_KEY) || '', save: (token) => uni.setStorageSync(ACCESS_KEY, token), clear: () => uni.removeStorageSync(ACCESS_KEY) }

export function request({ url, method = 'GET', data, mock, timeout = 12000 }) {
  if (isMockMode) return new Promise((resolve) => setTimeout(() => resolve({ code: 200, data: typeof mock === 'function' ? mock(data) : mock, message: 'success', msg: 'success', requestId: 'mock' }), 100))
  if (!BASE_URL) return Promise.reject(new Error('API 地址未配置'))
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('请求超时，请检查网络后重试')), timeout)
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: { ...(tokenStore.get() ? { Authorization: `Bearer ${tokenStore.get()}` } : {}) },
      success: ({ statusCode, data: response }) => {
        clearTimeout(timer)
        if (statusCode === 401 || response.code === 401) { tokenStore.clear(); reject(new Error('登录状态已失效')) }
        else if (statusCode >= 400 || response.code !== 200) reject(new Error(response.message || response.msg || '请求失败'))
        else resolve(response)
      },
      fail: (error) => { clearTimeout(timer); reject(error) }
    })
  })
}
