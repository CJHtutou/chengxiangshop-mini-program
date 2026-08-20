export const categories = [
  { id: 'all', name: '全部商品', icon: 'shop' },
  { id: 'raw', name: '原材沉香', icon: 'flag' },
  { id: 'bracelet', name: '沉香手串', icon: 'circle' },
  { id: 'incense', name: '线香香品', icon: 'paperplane' },
  { id: 'gift', name: '礼盒臻品', icon: 'gift' }
]

export const products = [
  {
    id: 'p-1001',
    categoryId: 'bracelet',
    title: '示例商品 A',
    shortTitle: '示例商品 A',
    price: 38.8,
    originalPrice: 68,
    sold: 213,
    rank: '本店销量榜第1',
    tag: '沉水级',
    stock: 88,
    image: '/static/images/product-car.jpg',
    gallery: [
      '/static/images/product-car.jpg',
      '/static/images/hero-brand.jpg'
    ],
    description: '选自海南与东南亚优质沉香原材，香气清甜内敛，适合日常佩戴与车内熏香。'
  },
  {
    id: 'p-1002',
    categoryId: 'bracelet',
    title: '印尼国宝 马来奇老土沉老料天然沉香手串圆珠单圈',
    shortTitle: '马来奇老料沉香手串',
    price: 888,
    originalPrice: 1080,
    sold: 46,
    rank: '本店人气榜第3',
    tag: '老料',
    stock: 16,
    image: '/static/images/product-bracelet.jpg',
    gallery: [
      '/static/images/product-bracelet.jpg',
      '/static/images/product-hand.jpg'
    ],
    description: '自然油线与深色木质纹理交织，每一颗珠子都经过手工修圆和多次抛光。'
  },
  {
    id: 'p-1003',
    categoryId: 'gift',
    title: '【预售】鑫金岁月 柬埔寨虫眼天然沉香精油礼盒1.5克装',
    shortTitle: '柬埔寨虫眼沉香精油礼盒',
    price: 399,
    originalPrice: 459,
    sold: 66,
    rank: '本店销量榜第9',
    tag: '预售',
    stock: 42,
    image: '/static/images/product-oil.jpg',
    gallery: [
      '/static/images/product-oil.jpg',
      '/static/images/product-incense.jpg'
    ],
    description: '一滴入香，幽香持久。礼盒内含沉香精油、香插与品牌收藏卡，适合送礼。'
  },
  {
    id: 'p-1004',
    categoryId: 'bracelet',
    title: '（预售）60年代台湾回流供奉料 老山檀香手串',
    shortTitle: '台湾回流老山檀手串',
    price: 436,
    originalPrice: 560,
    sold: 107,
    rank: '本店销量榜第2',
    tag: '回流老料',
    stock: 30,
    image: '/static/images/product-hand.jpg',
    gallery: [
      '/static/images/product-hand.jpg',
      '/static/images/product-bracelet.jpg'
    ],
    description: '纹理细密，檀香温润。精选台湾回流老料，佩戴后香气随体温慢慢舒展。'
  },
  {
    id: 'p-1005',
    categoryId: 'incense',
    title: '示例商品 E',
    shortTitle: '示例商品 E',
    price: 128,
    originalPrice: 158,
    sold: 89,
    rank: '新品榜第4',
    tag: '日常香事',
    stock: 120,
    image: '/static/images/product-incense.jpg',
    gallery: [
      '/static/images/product-incense.jpg',
      '/static/images/hero-brand.jpg'
    ],
    description: '自然香材研磨成粉，低温成香，燃烧平稳，适合晨起、阅读与茶席。'
  },
  {
    id: 'p-1006',
    categoryId: 'raw',
    title: '加里曼丹天然沉香 沉香茶杯垫 单片收藏级',
    shortTitle: '加里曼丹沉香茶杯垫',
    price: 358,
    originalPrice: 420,
    sold: 28,
    rank: '本店新品榜第8',
    tag: '收藏级',
    stock: 21,
    image: '/static/images/product-wood.jpg',
    gallery: [
      '/static/images/product-wood.jpg',
      '/static/images/product-car.jpg'
    ],
    description: '天然沉香切片打磨而成，茶汤温热时香气更显，兼具器物与收藏价值。'
  }
]

export const orders = []

export const users = []

export const dashboard = {
  metrics: [
    { label: '总销售额', value: 0, prefix: '¥', trend: '暂无环比数据', tone: 'gold' },
    { label: '订单量', value: 0, prefix: '', trend: '暂无环比数据', tone: 'green' },
    { label: '用户数', value: 0, prefix: '', trend: '暂无环比数据', tone: 'blue' },
    { label: '商品数', value: 0, prefix: '', trend: '暂无环比数据', tone: 'red' }
  ],
  sales: [],
  salesLabels: [],
  categorySales: []
}

export const apiResponse = (data, msg = 'success') => ({ code: 200, data, msg })

export function getProduct(id) {
  return products.find((product) => product.id === id)
}
