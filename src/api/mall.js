import { apiResponse, categories, getProduct, orders, products } from '../mock/index.js'

const delay = (value, duration = 120) => new Promise((resolve) => {
  setTimeout(() => resolve(apiResponse(value)), duration)
})

export const getHomeData = () => delay({
  categories: categories.filter((item) => item.id !== 'all'),
  products,
  banner: products.slice(0, 3)
})

export const getProducts = (params = {}) => {
  let list = [...products]
  if (params.categoryId && params.categoryId !== 'all') {
    list = list.filter((item) => item.categoryId === params.categoryId)
  }
  if (params.keyword) {
    const keyword = params.keyword.trim().toLowerCase()
    list = list.filter((item) => item.title.toLowerCase().includes(keyword))
  }
  if (params.sort === 'sales') list.sort((a, b) => b.sold - a.sold)
  if (params.sort === 'priceAsc') list.sort((a, b) => a.price - b.price)
  if (params.sort === 'priceDesc') list.sort((a, b) => b.price - a.price)
  if (params.sort === 'new') list.reverse()
  return delay(list)
}

export const getProductDetail = (id) => delay(getProduct(id))
export const getOrders = () => delay(orders)
