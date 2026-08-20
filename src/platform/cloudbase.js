let initialized = false

/**
 * 读取编译期注入的小程序 CloudBase 环境 ID。
 *
 * 该值来自 `mini-app/.env.example` 对应的本地环境文件，不能在代码中硬编码环境 ID。
 *
 * @returns {string} 已去除空白的环境 ID，未配置时为空字符串
 */
export function getCloudBaseEnvId() {
  return String(import.meta.env.VITE_CLOUDBASE_ENV_ID || '').trim()
}

/**
 * 初始化微信小程序 CloudBase 运行时。
 *
 * 此函数只应在 MP-WEIXIN 编译分支调用；H5 没有 `wx.cloud`，管理后台也不能复用
 * 小程序运行时。重复调用会直接返回，确保应用、请求和上传链路使用同一个环境。
 *
 * @returns {void}
 * @throws {Error} 环境 ID 缺失或当前基础库不支持云开发时抛出
 */
export function initCloudBase() {
  if (initialized) return
  const env = getCloudBaseEnvId()
  const wxRuntime = typeof globalThis !== 'undefined' ? globalThis.wx : undefined
  if (!env) throw new Error('微信小程序必须配置 VITE_CLOUDBASE_ENV_ID')
  if (!wxRuntime?.cloud) throw new Error('当前微信基础库不支持云开发')
  wxRuntime.cloud.init({ env, traceUser: true })
  initialized = true
}

/**
 * 调用统一 `api` 云函数。
 *
 * `data` 使用 `{ path, method, query, body }` 格式，由云函数归一化为内部请求；
 * 返回值保留 requestId，调用层应在报错时将其提供给运维排查。
 *
 * @param {object} data 云函数请求载荷
 * @param {number} [timeout=12000] 前端等待上限（毫秒）
 * @returns {Promise<object>} 云函数响应载荷
 */
export function callCloudFunction(data, timeout = 12000) {
  initCloudBase()
  const wxRuntime = typeof globalThis !== 'undefined' ? globalThis.wx : undefined
  if (!wxRuntime?.cloud) return Promise.reject(new Error('CloudBase 小程序 API 仅支持微信小程序运行环境'))
  return Promise.race([
    wxRuntime.cloud.callFunction({ name: 'api', data }).then(({ result }) => result),
    new Promise((_, reject) => setTimeout(() => reject(new Error('云函数请求超时，请检查网络后重试')), timeout))
  ])
}

/**
 * 将小程序本地文件上传到 CloudBase 云存储。
 *
 * 随机文件名避免同名覆盖和可预测路径；返回的 fileID 需再登记到 media_assets，
 * 不能把 cloudPath 或 fileID 当作永久公开图片 URL。
 *
 * @param {string} filePath 由微信选择器返回的临时文件路径
 * @param {string} [purpose='general'] 受控的业务用途目录
 * @returns {Promise<{fileID: string, cloudPath: string}>}
 */
export function uploadCloudFile(filePath, purpose = 'general') {
  initCloudBase()
  const wxRuntime = typeof globalThis !== 'undefined' ? globalThis.wx : undefined
  if (!wxRuntime?.cloud) return Promise.reject(new Error('CloudBase 文件上传仅支持微信小程序运行环境'))
  const extension = String(filePath).split('.').pop()?.toLowerCase() || 'jpg'
  const cloudPath = `${purpose}/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
  return wxRuntime.cloud.uploadFile({ cloudPath, filePath })
}
