let initialized = false

export function getCloudBaseEnvId() {
  return String(import.meta.env.VITE_CLOUDBASE_ENV_ID || '').trim()
}

export function initCloudBase() {
  if (initialized) return
  const env = getCloudBaseEnvId()
  const wxRuntime = typeof globalThis !== 'undefined' ? globalThis.wx : undefined
  if (!env) throw new Error('微信小程序必须配置 VITE_CLOUDBASE_ENV_ID')
  if (!wxRuntime?.cloud) throw new Error('当前微信基础库不支持云开发')
  wxRuntime.cloud.init({ env, traceUser: true })
  initialized = true
}

export function callCloudFunction(data, timeout = 12000) {
  initCloudBase()
  const wxRuntime = typeof globalThis !== 'undefined' ? globalThis.wx : undefined
  if (!wxRuntime?.cloud) return Promise.reject(new Error('CloudBase 小程序 API 仅支持微信小程序运行环境'))
  return Promise.race([
    wxRuntime.cloud.callFunction({ name: 'api', data }).then(({ result }) => result),
    new Promise((_, reject) => setTimeout(() => reject(new Error('云函数请求超时，请检查网络后重试')), timeout))
  ])
}

export function uploadCloudFile(filePath, purpose = 'general') {
  initCloudBase()
  const wxRuntime = typeof globalThis !== 'undefined' ? globalThis.wx : undefined
  if (!wxRuntime?.cloud) return Promise.reject(new Error('CloudBase 文件上传仅支持微信小程序运行环境'))
  const extension = String(filePath).split('.').pop()?.toLowerCase() || 'jpg'
  const cloudPath = `${purpose}/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
  return wxRuntime.cloud.uploadFile({ cloudPath, filePath })
}
