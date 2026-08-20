import { request } from './request.js'

const withMoney = (item) => ({ ...item, price: item.price ?? item.priceCents / 100, originalPrice: item.originalPrice ?? item.originalPriceCents / 100, tag: item.tag || item.tags?.[0] || '', gallery: item.gallery?.length ? item.gallery : item.image ? [item.image] : [] })
const statusMap = { PENDING_PAYMENT: ['待付款', 'to_pay'], TO_SHIP: ['待发货', 'to_ship'], SHIPPED: ['待收货', 'to_receive'], COMPLETED: ['已完成', 'completed'], CANCELLED: ['已取消', 'cancelled'], REFUNDING: ['退款中', 'after_sale'], REFUNDED: ['已退款', 'after_sale'] }
const withOrderDisplay = (item) => { const mapped = statusMap[item.status] || [item.status, item.statusKey]; const orderItems = Array.isArray(item.items) ? item.items : []; return { ...item, displayNo: item.orderNo || item.id, status: mapped[0], statusKey: mapped[1], amount: item.amount ?? (item.totalCents ?? item.amountCents ?? 0) / 100, items: item.itemsCount ?? orderItems.length, orderItems, itemsData: orderItems.map((entry) => ({ ...entry, image: entry.imageSnapshot, title: entry.titleSnapshot })), createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { hour12: false }) : item.createdAt } }
const queryString = (params) => Object.entries(params).filter(([, value]) => value !== '' && value != null).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')

export const getStoreConfig = () => request({ url: '/api/store-config' })
export const getCategories = () => request({ url: '/api/categories' })
export const getHomeData = async () => {
  const [categoryResult, productResult, configResult] = await Promise.all([getCategories(), getProducts({ page: 1, pageSize: 6, sort: 'sold' }), getStoreConfig()])
  return { code: 200, data: { categories: categoryResult.data, products: productResult.data.items, banners: configResult.data.banners || [], config: configResult.data }, message: 'success' }
}
export const getProducts = async (params = {}) => {
  const result = await request({ url: `/api/products?${queryString(params)}` })
  const payload = Array.isArray(result.data) ? { items: result.data, pagination: { total: result.data.length } } : result.data
  return { ...result, data: { ...payload, items: payload.items.map(withMoney) } }
}
export const getProductDetail = async (id) => { const result = await request({ url: `/api/products/${id}` }); return { ...result, data: withMoney(result.data) } }
export const getOrders = async (status = '') => { const result = await request({ url: `/api/orders${status ? `?status=${status}` : ''}` }); const list = Array.isArray(result.data) ? result.data : result.data.items; return { ...result, data: list.map(withOrderDisplay) } }
export const getOrderDetail = async (id) => { const result = await request({ url: `/api/orders/${id}` }); return { ...result, data: withOrderDisplay(result.data) } }
export const createOrder = (data) => request({ url: '/api/orders', method: 'POST', data })
export const createPayment = (id) => request({ url: `/api/orders/${id}/pay`, method: 'POST' })
export const getAfterSales = (status = '') => request({ url: `/api/after-sales${status ? `?status=${status}` : ''}` })
export const createAfterSale = (data) => request({ url: '/api/after-sales', method: 'POST', data })
export const cancelAfterSale = (id) => request({ url: `/api/after-sales/${id}/cancel`, method: 'POST' })
export const syncCart = (items) => request({ url: '/api/cart', method: 'PUT', data: { items } })
export const fetchAddresses = () => request({ url: '/api/addresses' })
export const saveAddress = (data) => request({ url: data.id ? `/api/addresses/${data.id}` : '/api/addresses', method: data.id ? 'PUT' : 'POST', data })
export const deleteAddress = (id) => request({ url: `/api/addresses/${id}`, method: 'DELETE' })
export const loginWechat = () => request({ url: '/api/auth/wechat', method: 'POST' })
