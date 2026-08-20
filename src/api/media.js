import { uploadCloudFile } from '../platform/cloudbase.js'
import { request } from './request.js'

/**
 * 上传图片并创建媒体元数据。
 *
 * 二进制先经 wx.cloud.uploadFile 写入云存储，随后调用 complete 接口生成 media_assets
 * 记录。业务表应保存返回的 mediaId；展示时由云函数换取临时 URL。
 *
 * @param {string} filePath 小程序临时文件路径
 * @param {string} [purpose='general'] 受控业务用途
 * @param {object} [metadata={}] 文件名、尺寸等元数据
 * @returns {Promise<object>} 含 mediaId 和 fileID 的响应
 */
export async function uploadMedia(filePath, purpose = 'general', metadata = {}) {
  const uploaded = await uploadCloudFile(filePath, purpose)
  const result = await request({
    url: '/api/media/complete',
    method: 'POST',
    data: { fileID: uploaded.fileID, cloudPath: uploaded.cloudPath, purpose, ...metadata }
  })
  return { ...result, data: { ...result.data, fileID: uploaded.fileID } }
}
