import { cloudbaseRequest } from './cloudbase-request.js'

const MODE = import.meta.env.VITE_BACKEND_MODE || (import.meta.env.DEV ? 'mock' : 'cloudbase')
const ACCESS_KEY = 'chengxiang-user-access-token'
if (import.meta.env.PROD && MODE !== 'cloudbase') throw new Error('生产环境必须设置 VITE_BACKEND_MODE=cloudbase，禁止回退 Mock 或旧 API')
export const isMockMode = import.meta.env.DEV && MODE === 'mock'
export const tokenStore = { get: () => uni.getStorageSync(ACCESS_KEY) || '', save: (token) => uni.setStorageSync(ACCESS_KEY, token), clear: () => uni.removeStorageSync(ACCESS_KEY) }

async function loadMockResponse(request) {
  const modulePath = ['..', 'mock', 'cloudbase-adapter.js'].join('/')
  const { mockCloudbaseResponse } = await import(/* @vite-ignore */ modulePath)
  return mockCloudbaseResponse(request)
}

export async function request({ url, method = 'GET', data, mock, timeout = 12000 }) {
  if (isMockMode) {
    const value = await loadMockResponse({ url, method, data, mock })
    return { code: 200, data: value, message: 'success', msg: 'success', requestId: 'mock' }
  }
  return cloudbaseRequest({ url, method, data, timeout })
}
