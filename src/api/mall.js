import { categories, getProduct, orders, products } from '../mock/index.js'
import { request } from './request.js'

const mockConfig = { version: 1, name: '黑盘羊沉香', subtitle: 'ARGAL · 2006', logoUrl: '', iconUrl: '', description: '天然为本，时间为证', phone: '15625056161', serviceWechat: '', serviceHours: '09:00-21:00', address: '广州市白云区同德街道西城智汇', businessOpen: true, banners: [] }
const mockAddresses = [{ id: 'mock-address', receiverName: '林墨', phone: '13800138000', province: '广东省', city: '广州市', district: '白云区', detail: '同德街道西城智汇 Park 7 栋', isDefault: true }]
const withMoney = (item) => ({ ...item, price: item.price ?? item.priceCents / 100, originalPrice: item.originalPrice ?? item.originalPriceCents / 100, tag: item.tag || item.tags?.[0] || '', gallery: item.gallery?.length ? item.gallery : item.image ? [item.image] : [] })
const statusMap = { PENDING_PAYMENT: ['待付款', 'to_pay'], TO_SHIP: ['待发货', 'to_ship'], SHIPPED: ['待收货', 'to_receive'], COMPLETED: ['已完成', 'completed'], CANCELLED: ['已取消', 'cancelled'], REFUNDING: ['退款中', 'after_sale'], REFUNDED: ['已退款', 'after_sale'] }
const withOrderDisplay = (item) => { const mapped = statusMap[item.status] || [item.status, item.statusKey]; return { ...item, status: mapped[0], statusKey: mapped[1], amount: item.amount ?? (item.totalCents ?? item.amountCents ?? 0) / 100, items: item.itemsCount ?? item.items?.length ?? item.items, itemsData: item.items?.map((entry) => ({ image: entry.imageSnapshot, title: entry.titleSnapshot })) || [], createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { hour12: false }) : item.createdAt } }
const queryString = (params) => new URLSearchParams(Object.entries(params).filter(([, value]) => value !== '' && value != null)).toString()

export const getStoreConfig = () => request({ url: '/api/store-config', mock: mockConfig })
export const getCategories = () => request({ url: '/api/categories', mock: categories.filter((item) => item.id !== 'all') })
export const getHomeData = async () => {
  const [categoryResult, productResult, configResult] = await Promise.all([getCategories(), getProducts({ page: 1, pageSize: 6, sort: 'sold' }), getStoreConfig()])
  return { code: 200, data: { categories: categoryResult.data, products: productResult.data.items, banners: configResult.data.banners || [], config: configResult.data }, message: 'success' }
}
export const getProducts = async (params = {}) => {
  const result = await request({ url: `/api/products?${queryString(params)}`, mock: () => {
    let list = [...products]
    if (params.categoryId && params.categoryId !== 'all') list = list.filter((item) => item.categoryId === params.categoryId)
    if (params.keyword) { const keyword = params.keyword.trim().toLowerCase(); list = list.filter((item) => item.title.toLowerCase().includes(keyword)) }
    if (params.sort === 'sold' || params.sort === 'sales') list.sort((a, b) => b.sold - a.sold)
    if (params.sort === 'priceAsc') list.sort((a, b) => a.price - b.price)
    if (params.sort === 'priceDesc') list.sort((a, b) => b.price - a.price)
    if (params.sort === 'new') list.reverse()
    return { items: list, pagination: { page: 1, pageSize: list.length, total: list.length, pages: 1 } }
  } })
  const payload = Array.isArray(result.data) ? { items: result.data, pagination: { total: result.data.length } } : result.data
  return { ...result, data: { ...payload, items: payload.items.map(withMoney) } }
}
export const getProductDetail = async (id) => { const result = await request({ url: `/api/products/${id}`, mock: getProduct(id) }); return { ...result, data: withMoney(result.data) } }
export const getOrders = async (status = '') => { const result = await request({ url: `/api/orders${status ? `?status=${status}` : ''}`, mock: { items: orders, pagination: { total: orders.length } } }); const list = Array.isArray(result.data) ? result.data : result.data.items; return { ...result, data: list.map(withOrderDisplay) } }
export const getOrderDetail = async (id) => { const result = await request({ url: `/api/orders/${id}`, mock: orders.find((item) => item.id === id) }); return { ...result, data: withOrderDisplay(result.data) } }
export const createOrder = (data) => request({ url: '/api/orders', method: 'POST', data, mock: { id: `CX${Date.now()}`, status: 'PENDING_PAYMENT', totalCents: 0 } })
export const createPayment = (id) => request({ url: `/api/orders/${id}/pay`, method: 'POST', mock: { mode: 'sandbox', requiresExplicitConfirmation: true } })
export const confirmSandboxPayment = (id) => request({ url: `/api/payments/sandbox/${id}/confirm`, method: 'POST', mock: null })
export const getAfterSales = (status = '') => request({ url: `/api/after-sales${status ? `?status=${status}` : ''}`, mock: { items: [], pagination: { total: 0 } } })
export const createAfterSale = (data) => request({ url: '/api/after-sales', method: 'POST', data, mock: { id: `after-sale-${Date.now()}`, ...data, status: 'PENDING', createdAt: new Date().toISOString() } })
export const cancelAfterSale = (id) => request({ url: `/api/after-sales/${id}/cancel`, method: 'POST', mock: null })
export const syncCart = (items) => request({ url: '/api/cart', method: 'PUT', data: { items }, mock: null })
export const fetchAddresses = () => request({ url: '/api/addresses', mock: mockAddresses })
export const saveAddress = (data) => request({ url: data.id ? `/api/addresses/${data.id}` : '/api/addresses', method: data.id ? 'PUT' : 'POST', data, mock: () => { const index = mockAddresses.findIndex((item) => item.id === data.id); const value = { ...data, id: data.id || `address-${Date.now()}` }; if (index >= 0) mockAddresses[index] = value; else mockAddresses.push(value); return value } })
export const deleteAddress = (id) => request({ url: `/api/addresses/${id}`, method: 'DELETE', mock: () => { const index = mockAddresses.findIndex((item) => item.id === id); if (index >= 0) mockAddresses.splice(index, 1); return null } })
export const loginWechat = (code) => request({ url: '/api/auth/wechat', method: 'POST', data: { code }, mock: { accessToken: 'mock-user', user: { id: 'mock-user', nickname: '微信用户' } } })
