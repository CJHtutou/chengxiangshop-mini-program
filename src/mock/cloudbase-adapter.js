import { categories, getProduct, orders, products } from './index.js'
import { mockBrandContent } from '../../../shared/mock/brand.js'
import { mockHomeContent } from '../../../shared/mock/content.js'
import { mockMarketingPopup } from '../../../shared/mock/marketing.js'

const config = { version: 1, initialized: true, name: '示例商城', subtitle: 'DEMO STORE', logoUrl: '', iconUrl: '', description: '仅用于本地开发的中性示例配置。', brandSlogan: '', phone: '', serviceWechat: '', serviceHours: '', address: '', businessOpen: true, banners: [] }
const addresses = []

function parse(url) { const [path, search = ''] = url.split('?'); return { path, query: Object.fromEntries(new URLSearchParams(search)) } }
function productsPage(query) {
  let items = [...products]
  if (query.categoryId && query.categoryId !== 'all') items = items.filter((item) => item.categoryId === query.categoryId)
  if (query.keyword) { const keyword = query.keyword.trim().toLowerCase(); items = items.filter((item) => item.title.toLowerCase().includes(keyword)) }
  if (query.sort === 'sold' || query.sort === 'sales') items.sort((a, b) => b.sold - a.sold)
  if (query.sort === 'priceAsc') items.sort((a, b) => a.price - b.price)
  if (query.sort === 'priceDesc') items.sort((a, b) => b.price - a.price)
  if (query.sort === 'new') items.reverse()
  return { items, pagination: { page: 1, pageSize: items.length, total: items.length, pages: 1 } }
}

export async function mockCloudbaseResponse({ url, method = 'GET', data = {} }) {
  const { path, query } = parse(url)
  if (path === '/api/store-config') return structuredClone(config)
  if (path === '/api/categories') return categories.filter((item) => item.id !== 'all')
  if (path === '/api/products') return productsPage(query)
  if (path.startsWith('/api/products/')) return getProduct(path.split('/').pop())
  if (path === '/api/page-content/home') return structuredClone(mockHomeContent)
  if (path === '/api/page-content/brand') return structuredClone(mockBrandContent)
  if (path === '/api/marketing-popups/active') return structuredClone(mockMarketingPopup)
  if (path === '/api/auth/wechat') return { accessToken: 'mock-user', user: { id: 'mock-user', nickname: '微信用户' } }
  if (path === '/api/addresses' && method === 'GET') return structuredClone(addresses)
  if (path === '/api/addresses' && method === 'POST') { const item = { ...data, id: `address-${Date.now()}` }; addresses.push(item); return item }
  if (path.startsWith('/api/addresses/') && method === 'PUT') { const id = path.split('/').pop(); const index = addresses.findIndex((item) => item.id === id); const item = { ...addresses[index], ...data, id }; addresses[index] = item; return item }
  if (path.startsWith('/api/addresses/') && method === 'DELETE') { const index = addresses.findIndex((item) => item.id === path.split('/').pop()); if (index >= 0) addresses.splice(index, 1); return null }
  if (path === '/api/orders' && method === 'GET') return { items: structuredClone(orders), pagination: { total: orders.length } }
  if (path === '/api/orders' && method === 'POST') return { id: `order-${Date.now()}`, orderNo: `DEMO${Date.now()}`, status: 'PENDING_PAYMENT', totalCents: 0, items: [] }
  if (path.startsWith('/api/orders/') && method === 'GET') return orders.find((item) => item.id === path.split('/').pop())
  if (path.endsWith('/pay') && method === 'POST') return { timeStamp: String(Math.floor(Date.now() / 1000)), nonceStr: 'mock-nonce', package: 'prepay_id=mock', signType: 'RSA', paySign: 'mock-sign' }
  if (path === '/api/after-sales' && method === 'GET') return { items: [], pagination: { total: 0 } }
  if (path === '/api/after-sales' && method === 'POST') return { id: `after-sale-${Date.now()}`, ...data, status: 'PENDING', createdAt: new Date().toISOString() }
  if (path.startsWith('/api/after-sales/') || path === '/api/cart' || path.startsWith('/api/marketing-popups/')) return null
  throw new Error(`开发 Mock 未实现接口：${method} ${path}`)
}
