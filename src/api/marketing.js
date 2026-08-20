import { request } from './request.js'

export const getActivePopup = () => request({ url: '/api/marketing-popups/active' })
export const reportPopupImpression = (id) => request({ url: `/api/marketing-popups/${id}/impression`, method: 'POST' })
export const reportPopupClose = (id) => request({ url: `/api/marketing-popups/${id}/close`, method: 'POST' })
export const claimPopupCoupon = (id) => request({ url: `/api/marketing-popups/${id}/claim`, method: 'POST' })
