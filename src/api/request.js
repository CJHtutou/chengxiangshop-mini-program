const BASE_URL = ''

export function request({ url, method = 'GET', data }) {
  // 此处需替换为真实接口：设置 BASE_URL 后即可切换为服务端请求。
  if (!BASE_URL) return Promise.resolve({ code: 200, data, msg: 'mock success' })

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      success: ({ data: response }) => {
        if (response.code === 200) resolve(response)
        else reject(new Error(response.msg || '请求失败'))
      },
      fail: reject
    })
  })
}
