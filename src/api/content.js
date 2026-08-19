import { mockBrandContent } from '../../../shared/mock/brand.js'
import { mockHomeContent } from '../../../shared/mock/content.js'
import { request } from './request.js'

export const getHomePageContent = () => request({ url: '/api/page-content/home', mock: () => structuredClone(mockHomeContent) })
export const getBrandPageContent = () => request({ url: '/api/page-content/brand', mock: () => structuredClone(mockBrandContent) })
