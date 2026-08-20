import { request } from './request.js'

export const getHomePageContent = () => request({ url: '/api/page-content/home' })
export const getBrandPageContent = () => request({ url: '/api/page-content/brand' })
