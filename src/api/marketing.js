import { mockMarketingPopup } from '../../../shared/mock/marketing.js'
import { request } from './request.js'

export const getActivePopup = () => request({ url: '/api/marketing-popups/active', mock: () => structuredClone(mockMarketingPopup) })
export const reportPopupImpression = (id) => request({ url: `/api/marketing-popups/${id}/impression`, method: 'POST', mock: null })
export const reportPopupClose = (id) => request({ url: `/api/marketing-popups/${id}/close`, method: 'POST', mock: null })
export const claimPopupCoupon = (id) => request({ url: `/api/marketing-popups/${id}/claim`, method: 'POST', mock: () => ({ id: `coupon-${id}`, status: 'AVAILABLE' }) })
