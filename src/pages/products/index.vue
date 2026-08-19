<template>
  <view class="page-shell products-page">
    <MallHeader title="" :show-back="true" />
    <view class="products-head">
      <view class="products-head__tabs">
        <text class="products-head__tab products-head__tab--active">列表</text>
        <text class="products-head__tab">推荐</text>
      </view>
      <SearchBar v-model="keyword" @search="loadProducts" />
    </view>

    <scroll-view class="category-scroll" scroll-x :show-scrollbar="false">
      <view class="category-scroll__inner">
        <view
          v-for="category in categories"
          :key="category.id"
          class="category-chip pressable"
          :class="{ 'category-chip--active': categoryId === category.id }"
          @click="selectCategory(category.id)"
        >{{ category.name }}</view>
      </view>
    </scroll-view>

    <view class="sort-bar">
      <view v-for="item in sortItems" :key="item.value" class="sort-bar__item pressable" :class="{ 'sort-bar__item--active': sort === item.value || (item.value === 'price' && sort.startsWith('price')) }" @click="setSort(item.value)">
        <text>{{ item.label }}</text>
        <uni-icons v-if="item.value === 'price'" type="arrowup" size="13" :color="sort.startsWith('price') ? '#e43a35' : '#8a918e'" />
      </view>
      <view class="sort-bar__item pressable"><uni-icons type="settings" size="19" color="#767d7a" /></view>
    </view>

    <view v-if="loading" class="loading-grid">
      <view v-for="index in 4" :key="index" class="skeleton" />
    </view>
    <view v-else-if="filteredProducts.length" class="product-grid">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </view>
    <view v-else class="empty-state">
      <uni-icons type="search" size="50" color="#c5c9c7" />
      <text>没有找到相关香品</text>
      <button class="empty-state__button pressable" @click="reset">查看全部</button>
    </view>

    <BottomNav active="products" />
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { categories as mockCategories } from '../../mock/index.js'
import { getProducts } from '../../api/mall.js'
import BottomNav from '../../components/BottomNav.vue'
import MallHeader from '../../components/MallHeader.vue'
import ProductCard from '../../components/ProductCard.vue'
import SearchBar from '../../components/SearchBar.vue'

const categories = mockCategories
const keyword = ref('')
const categoryId = ref('all')
const sort = ref('default')
const loading = ref(true)
const filteredProducts = ref([])
const sortItems = [
  { label: '综合', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格', value: 'price' },
  { label: '上新', value: 'new' }
]

onLoad((options) => {
  keyword.value = options.keyword ? decodeURIComponent(options.keyword) : ''
  categoryId.value = options.category || 'all'
  loadProducts()
})

async function loadProducts() {
  loading.value = true
  const { data } = await getProducts({ keyword: keyword.value, categoryId: categoryId.value, sort: sort.value })
  filteredProducts.value = data
  loading.value = false
}

function selectCategory(id) {
  categoryId.value = id
  loadProducts()
}

function setSort(value) {
  if (value === 'price') sort.value = sort.value === 'priceAsc' ? 'priceDesc' : 'priceAsc'
  else sort.value = value
  loadProducts()
}

function reset() {
  keyword.value = ''
  categoryId.value = 'all'
  sort.value = 'default'
  loadProducts()
}
</script>

<style scoped lang="scss">
.products-page { background: #f4f4f2; }
.products-head { padding: 0 22rpx 18rpx; background: #fff; }
.products-head__tabs { display: flex; justify-content: center; gap: 52rpx; margin-top: -84rpx; margin-bottom: 36rpx; pointer-events: none; }
.products-head__tab { position: relative; color: #9b9f9d; font-size: 32rpx; font-weight: 600; }
.products-head__tab--active { color: #111; }
.products-head__tab--active::after { position: absolute; bottom: -13rpx; left: 50%; width: 44rpx; height: 5rpx; transform: translateX(-50%); border-radius: 3rpx; background: #111; content: ''; }
.category-scroll { border-top: 1rpx solid #f1f1ef; background: #fff; white-space: nowrap; }
.category-scroll__inner { display: inline-flex; gap: 14rpx; padding: 18rpx 22rpx; }
.category-chip { padding: 12rpx 22rpx; border-radius: 30rpx; background: #f3f3f1; color: #636a67; font-size: 23rpx; }
.category-chip--active { background: #153f37; color: #fff; }
.sort-bar { display: grid; grid-template-columns: repeat(5, 1fr); height: 84rpx; align-items: center; border-top: 1rpx solid #f2f2ef; background: #fff; }
.sort-bar__item { display: flex; min-width: 0; height: 84rpx; align-items: center; justify-content: center; gap: 3rpx; color: #747b78; font-size: 25rpx; }
.sort-bar__item--active { color: #e43a35; font-weight: 600; }
.product-grid, .loading-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16rpx; padding: 18rpx 18rpx 36rpx; }
.skeleton { height: 540rpx; border-radius: 10rpx; background: linear-gradient(90deg, #e9eae8, #f6f6f5, #e9eae8); background-size: 200% 100%; animation: loading 1.2s infinite; }
.empty-state { display: flex; min-height: 640rpx; flex-direction: column; align-items: center; justify-content: center; color: #929895; font-size: 27rpx; }
.empty-state > text { margin-top: 20rpx; }
.empty-state__button { width: 220rpx; height: 72rpx; margin-top: 32rpx; border-radius: 36rpx; background: #e43a35; color: #fff; font-size: 26rpx; line-height: 72rpx; }
@keyframes loading { to { background-position: -200% 0; } }
</style>
