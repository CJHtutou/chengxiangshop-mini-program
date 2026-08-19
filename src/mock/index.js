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
    title: '黑盘羊香堂 沉水级国奇楠 十全十美碎银沉香车挂件',
    shortTitle: '国奇楠沉香车挂件',
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
    title: '黑盘羊沉香堂 天然原材线香 30支收藏装',
    shortTitle: '天然原材线香收藏装',
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

export const orders = [
  { id: 'CX202608190001', user: '林墨', amount: 888, status: '待发货', statusKey: 'to_ship', items: 1, createdAt: '2026-08-19 10:24' },
  { id: 'CX202608180017', user: '周先生', amount: 437.8, status: '待收货', statusKey: 'to_receive', items: 2, createdAt: '2026-08-18 18:42' },
  { id: 'CX202608180011', user: '陈女士', amount: 399, status: '已完成', statusKey: 'completed', items: 1, createdAt: '2026-08-18 15:09' },
  { id: 'CX202608170006', user: '王也', amount: 128, status: '待付款', statusKey: 'to_pay', items: 1, createdAt: '2026-08-17 21:30' },
  { id: 'CX202608160021', user: '赵可', amount: 1324, status: '已完成', statusKey: 'completed', items: 2, createdAt: '2026-08-16 12:08' }
]

export const users = [
  { id: 'u-01', name: '林墨', phone: '138****2268', level: '沉香藏家', spent: 6280, joinedAt: '2025-08-16', avatar: '林' },
  { id: 'u-02', name: '周先生', phone: '186****0914', level: '高级会员', spent: 3120, joinedAt: '2025-10-28', avatar: '周' },
  { id: 'u-03', name: '陈女士', phone: '139****6612', level: '香事新友', spent: 980, joinedAt: '2026-01-05', avatar: '陈' },
  { id: 'u-04', name: '王也', phone: '157****7789', level: '香事新友', spent: 460, joinedAt: '2026-03-13', avatar: '王' },
  { id: 'u-05', name: '赵可', phone: '133****4081', level: '高级会员', spent: 1860, joinedAt: '2026-04-21', avatar: '赵' }
]

export const dashboard = {
  metrics: [
    { label: '本月销售额', value: 128460, prefix: '¥', trend: '+18.6%', tone: 'gold' },
    { label: '本月订单量', value: 328, prefix: '', trend: '+12.4%', tone: 'green' },
    { label: '会员总数', value: 12890, prefix: '', trend: '+8.9%', tone: 'blue' },
    { label: '在售商品', value: 86, prefix: '', trend: '+4.2%', tone: 'red' }
  ],
  sales: [12000, 15600, 13200, 18800, 21600, 20800, 24400, 28600, 27200, 31900, 30500, 35800],
  salesLabels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
  categorySales: [
    { name: '沉香手串', value: 42 },
    { name: '礼盒臻品', value: 26 },
    { name: '线香香品', value: 18 },
    { name: '原材沉香', value: 14 }
  ]
}

export const apiResponse = (data, msg = 'success') => ({ code: 200, data, msg })

export function getProduct(id) {
  return products.find((product) => product.id === id)
}
