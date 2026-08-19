<template>
  <view class="page-shell home-page">
    <MallHeader />

    <view class="home-top">
      <SearchBar v-model="keyword" @search="search" />
    </view>
    <view v-if="loadError" class="network-state"><text>{{ loadError }}</text><button class="pressable" @click="loadHome">重试</button></view>

    <swiper v-if="slides.length" class="hero" circular autoplay :interval="4200" indicator-dots indicator-color="rgba(255,255,255,.45)" indicator-active-color="#d8ad6e">
      <swiper-item v-for="(slide, index) in slides" :key="index">
        <view class="hero__slide">
          <image class="hero__image" :src="slide.image" mode="aspectFill" />
          <view class="hero__scrim" />
          <view class="hero__content">
            <text class="hero__eyebrow">{{ storeConfig.config.subtitle }}</text>
            <text class="hero__title">{{ slide.title }}</text>
            <text class="hero__copy">{{ slide.copy }}</text>
            <button class="hero__button pressable" @click="goProducts">探索香品</button>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view class="brand-proof">
      <view><text class="brand-proof__value">19</text><text class="brand-proof__label">年专注沉香</text></view>
      <view><text class="brand-proof__value">100%</text><text class="brand-proof__label">真沉香原材</text></view>
      <view><text class="brand-proof__value">6,000+</text><text class="brand-proof__label">藏家信任</text></view>
    </view>

    <view class="section category-section">
      <view class="category-grid">
        <view v-for="category in categories" :key="category.id" class="category pressable" @click="openCategory(category.id)">
          <view class="category__icon"><uni-icons :type="category.icon" size="27" color="#0d2f2b" /></view>
          <text class="category__name">{{ category.name }}</text>
        </view>
      </view>
    </view>

    <view class="seckill pressable" @click="goProducts">
      <view>
        <view class="seckill__heading">
          <text class="seckill__title">限时雅集</text>
          <text class="seckill__tag">今日专享</text>
        </view>
        <text class="seckill__copy">精选藏品限时礼遇</text>
      </view>
      <view class="seckill__timer">
        <text>02</text><text class="seckill__colon">:</text><text>18</text><text class="seckill__colon">:</text><text>36</text>
      </view>
    </view>

    <view class="story-card pressable" @click="goBrand">
      <image class="story-card__image" src="/static/images/hero-brand.jpg" mode="aspectFill" />
      <view class="story-card__scrim" />
      <view class="story-card__content">
        <text class="story-card__eyebrow">{{ storeConfig.storeName }} · 品牌故事</text>
        <text class="story-card__title">一炉真香，守住时间的味道</text>
        <text class="story-card__link">了解品牌历程 →</text>
      </view>
    </view>

    <view class="recommend-heading">
      <view>
        <text class="recommend-heading__title">本周推荐</text>
        <text class="recommend-heading__sub">懂香之人的共同选择</text>
      </view>
      <text class="recommend-heading__all pressable" @click="goProducts">全部商品</text>
    </view>

    <view class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </view>

    <FloatingService />
    <BottomNav active="home" />
    <CouponModal :visible="showCoupon" @close="showCoupon = false" @claim="claimCoupon" />
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import BottomNav from '../../components/BottomNav.vue'
import CouponModal from '../../components/CouponModal.vue'
import FloatingService from '../../components/FloatingService.vue'
import MallHeader from '../../components/MallHeader.vue'
import ProductCard from '../../components/ProductCard.vue'
import SearchBar from '../../components/SearchBar.vue'
import { getHomeData } from '../../api/mall.js'
import { useStoreConfigStore } from '../../stores/store-config.js'

const keyword = ref('')
const categories = ref([])
const products = ref([])
const showCoupon = ref(false)
const loadError = ref('')
const storeConfig = useStoreConfigStore()
const fallbackSlides = [
  {
    image: '/static/images/hero-brand.jpg',
    title: '老羊黑盘羊沉香',
    copy: '专注野生沉香 19 年 · 每一缕香都有出处'
  },
  {
    image: '/static/images/product-incense.jpg',
    title: '一席香事，自在相逢',
    copy: '精选原材 · 手作成香 · 雅集品鉴'
  },
  {
    image: '/static/images/product-bracelet.jpg',
    title: '天然为本，时间为证',
    copy: '从原材到成品，严守每一道工序'
  }
]
const slides = computed(() => storeConfig.config.banners?.length ? storeConfig.config.banners.map((item) => ({ image: item.image, title: item.title || storeConfig.storeName, copy: item.subtitle || storeConfig.config.description, linkType: item.linkType, linkTarget: item.linkTarget })) : fallbackSlides)

async function loadHome(force = false) {
  loadError.value = ''
  try {
    if (force) await storeConfig.load(true)
    const { data } = await getHomeData()
    categories.value = data.categories
    products.value = data.products.slice(0, 6)
  } catch (error) { loadError.value = error.message || '网络异常，请稍后重试' }
}
onMounted(async () => {
  await loadHome()
  setTimeout(() => {
    if (!uni.getStorageSync('coupon-seen')) showCoupon.value = true
  }, 500)
})
onPullDownRefresh(async () => { await loadHome(true); uni.stopPullDownRefresh() })

function search() {
  uni.navigateTo({ url: `/pages/products/index?keyword=${encodeURIComponent(keyword.value)}` })
}

function openCategory(categoryId) {
  uni.navigateTo({ url: `/pages/products/index?category=${categoryId}` })
}

function goProducts() { uni.navigateTo({ url: '/pages/products/index' }) }
function goBrand() { uni.navigateTo({ url: '/pages/brand/index' }) }
function claimCoupon() {
  uni.setStorageSync('coupon-seen', true)
  showCoupon.value = false
  uni.showToast({ title: '领取成功', icon: 'success' })
}
</script>

<style scoped lang="scss">
.home-page { background: #f5f5f3; }
.home-top { padding: 18rpx 22rpx 22rpx; background: #f5f5f3; }
.network-state { display: flex; min-height: 80rpx; align-items: center; justify-content: space-between; padding: 14rpx 22rpx; background: #fff2f1; color: #a53b35; font-size: 23rpx; }
.network-state button { width: 120rpx; height: 58rpx; margin: 0; border: 1rpx solid #c85b54; border-radius: 29rpx; background: #fff; color: #a53b35; font-size: 22rpx; line-height: 56rpx; }
.hero { height: 660rpx; }
.hero__slide { position: relative; height: 100%; overflow: hidden; background: #0d2f2b; }
.hero__image { width: 100%; height: 100%; }
.hero__scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(3,14,12,.9) 0%, rgba(3,14,12,.55) 54%, rgba(3,14,12,.12) 100%); }
.hero__content { position: absolute; right: 54rpx; bottom: 82rpx; left: 54rpx; display: flex; max-width: 570rpx; flex-direction: column; align-items: flex-start; color: #fff; }
.hero__eyebrow { color: #d7ae70; font-size: 23rpx; font-weight: 600; }
.hero__title { margin-top: 14rpx; font-family: "STKaiti", "KaiTi", serif; font-size: 58rpx; font-weight: 700; line-height: 1.25; }
.hero__copy { max-width: 510rpx; margin-top: 16rpx; color: #e8dfd2; font-size: 27rpx; line-height: 44rpx; }
.hero__button { height: 72rpx; margin: 34rpx 0 0; padding: 0 32rpx; border: 1rpx solid rgba(226,196,144,.65); border-radius: 4rpx; background: rgba(11,41,36,.82); color: #efd7ac; font-size: 26rpx; line-height: 72rpx; }
.brand-proof { display: grid; grid-template-columns: repeat(3, 1fr); padding: 32rpx 8rpx; background: #0d2f2b; color: #fff; }
.brand-proof > view { display: flex; flex-direction: column; align-items: center; border-right: 1rpx solid rgba(255,255,255,.16); }
.brand-proof > view:last-child { border: 0; }
.brand-proof__value { color: #dfbb7b; font-size: 31rpx; font-weight: 700; }
.brand-proof__label { margin-top: 8rpx; color: #cedbd6; font-size: 20rpx; }
.section { padding: 28rpx 22rpx; }
.category-section { background: #fff; }
.category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20rpx 8rpx; }
.category { display: flex; min-width: 0; flex-direction: column; align-items: center; }
.category__icon { display: flex; width: 92rpx; height: 92rpx; align-items: center; justify-content: center; border-radius: 50%; background: #eef2ef; color: #0d2f2b; font-size: 42rpx; }
.category__name { margin-top: 12rpx; color: #39413e; font-size: 23rpx; }
.seckill { display: flex; align-items: center; justify-content: space-between; margin: 20rpx 22rpx; padding: 26rpx 28rpx; border-radius: 8rpx; background: #182f2b; color: #fff; }
.seckill__heading { display: flex; align-items: center; gap: 12rpx; }
.seckill__title { color: #ead2a8; font-size: 33rpx; font-weight: 700; }
.seckill__tag { padding: 5rpx 10rpx; border-radius: 4rpx; background: #e43a35; font-size: 19rpx; }
.seckill__copy { display: block; margin-top: 8rpx; color: #aebdb8; font-size: 22rpx; }
.seckill__timer { display: flex; align-items: center; gap: 6rpx; font-variant-numeric: tabular-nums; }
.seckill__timer > text:not(.seckill__colon) { padding: 10rpx; border-radius: 4rpx; background: #f4ecdd; color: #2e3a36; font-size: 25rpx; font-weight: 700; }
.seckill__colon { color: #c99a55; }
.story-card { position: relative; height: 360rpx; margin: 22rpx; overflow: hidden; border-radius: 8rpx; }
.story-card__image { width: 100%; height: 100%; }
.story-card__scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(7,31,27,.92), rgba(7,31,27,.28)); }
.story-card__content { position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: flex; flex-direction: column; justify-content: center; padding: 40rpx; color: #fff; }
.story-card__eyebrow { color: #dcb875; font-size: 22rpx; }
.story-card__title { width: 70%; margin-top: 16rpx; font-family: "STKaiti", serif; font-size: 42rpx; line-height: 1.45; }
.story-card__link { margin-top: 28rpx; color: #ead8b8; font-size: 24rpx; }
.recommend-heading { display: flex; align-items: flex-end; justify-content: space-between; padding: 20rpx 22rpx 18rpx; }
.recommend-heading__title { display: block; font-size: 36rpx; font-weight: 700; }
.recommend-heading__sub { display: block; margin-top: 8rpx; color: #8a918e; font-size: 22rpx; }
.recommend-heading__all { padding: 18rpx 0; color: #7b5940; font-size: 24rpx; }
.product-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16rpx; padding: 0 22rpx 34rpx; }
</style>
