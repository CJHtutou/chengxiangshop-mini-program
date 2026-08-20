import { uploadCloudFile } from '../platform/cloudbase.js'
import { request } from './request.js'

export async function uploadMedia(filePath, purpose = 'general', metadata = {}) {
  const uploaded = await uploadCloudFile(filePath, purpose)
  const result = await request({
    url: '/api/media/complete',
    method: 'POST',
    data: { fileID: uploaded.fileID, cloudPath: uploaded.cloudPath, purpose, ...metadata }
  })
  return { ...result, data: { ...result.data, fileID: uploaded.fileID } }
}
