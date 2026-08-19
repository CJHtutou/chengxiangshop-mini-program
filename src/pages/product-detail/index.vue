<template>
  <view v-if="product" class="detail-page">
    <MallHeader title="商品详情" :show-back="true" />
    <swiper class="gallery" circular indicator-dots indicator-color="rgba(255,255,255,.55)" indicator-active-color="#e43a35">
      <swiper-item v-for="image in product.gallery" :key="image">
        <image class="gallery__image" :src="image" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="detail-info">
      <view class="detail-info__price-row">
        <view><text class="detail-info__currency">¥</text><text class="detail-info__price price-number">{{ product.price }}</text><text class="detail-info__original">¥{{ product.originalPrice }}</text></view>
        <text class="detail-info__sold">已售 {{ product.sold }}</text>
      </view>
      <text class="detail-info__tag">{{ product.tag }}</text>
      <text class="detail-info__title">{{ product.title }}</text>
      <view class="detail-info__benefits">
        <text>正品保障</text><text>·</text><text>产区可溯</text><text>·</text><text>48小时发货</text>
      </view>
    </view>

    <view class="detail-panel pressable" @click="showSku = true">
      <text class="detail-panel__label">已选</text>
      <text class="detail-panel__value">{{ selectedSku }}，{{ quantity }}件</text>
      <uni-icons type="right" size="18" color="#9da29f" />
    </view>
    <view class="detail-panel">
      <text class="detail-panel__label">送至</text>
      <text class="detail-panel__value">广东省 广州市 白云区 · 现货</text>
      <uni-icons type="right" size="18" color="#9da29f" />
    </view>

    <view class="brand-card">
      <view class="brand-card__mark">羊</view>
      <view class="brand-card__copy">
        <text class="brand-card__name">黑盘羊沉香堂</text>
        <text class="brand-card__meta">19年专注天然沉香 · 广州实体店</text>
      </view>
      <button class="brand-card__button pressable" @click="goBrand">进店</button>
    </view>

    <view class="description">
      <view class="description__heading"><text>商品详情</text><text>香材与工艺</text></view>
      <image class="description__hero" :src="product.gallery[1]" mode="aspectFill" />
      <text class="description__title">天然香韵，缓慢舒展</text>
      <text class="description__copy">{{ product.description }}</text>
      <view class="description__feature-grid">
        <view><text class="description__feature-value">19年</text><text>选香经验</text></view>
        <view><text class="description__feature-value">100%</text><text>天然原材</text></view>
        <view><text class="description__feature-value">一物一图</text><text>实物品控</text></view>
      </view>
    </view>

    <view class="action-bar">
      <view class="action-bar__minor pressable" @click="goHome"><uni-icons type="home" size="24" color="#3f4744" /><text>店铺</text></view>
      <view class="action-bar__minor pressable" @click="goCart"><uni-icons type="cart" size="24" color="#3f4744" /><text>购物车</text><text v-if="cart.totalCount" class="action-bar__badge">{{ cart.totalCount }}</text></view>
      <button class="action-bar__button action-bar__button--cart pressable" @click="openSku('cart')">加入购物车</button>
      <button class="action-bar__button action-bar__button--buy pressable" @click="openSku('buy')">立即购买</button>
    </view>

    <view v-if="showSku" class="sheet-mask" @click.self="showSku = false">
      <view class="sku-sheet">
        <view class="sku-sheet__head">
          <image :src="product.image" mode="aspectFill" />
          <view><text class="sku-sheet__price">¥{{ product.price }}</text><text class="sku-sheet__stock">库存 {{ product.stock }} 件</text><text class="sku-sheet__selected">已选：{{ selectedSku }}</text></view>
          <view class="sku-sheet__close pressable" @click="showSku = false"><uni-icons type="closeempty" size="24" color="#4e5653" /></view>
        </view>
        <text class="sku-sheet__label">规格</text>
        <view class="sku-sheet__options">
          <view v-for="sku in skuOptions" :key="sku" class="sku-sheet__option pressable" :class="{ 'sku-sheet__option--active': selectedSku === sku }" @click="selectedSku = sku">{{ sku }}</view>
        </view>
        <view class="sku-sheet__quantity">
          <text class="sku-sheet__label">数量</text>
          <view class="stepper"><view class="pressable" @click="quantity = Math.max(1, quantity - 1)">−</view><text>{{ quantity }}</text><view class="pressable" @click="quantity = Math.min(product.stock, quantity + 1)">＋</view></view>
        </view>
        <button class="sku-sheet__confirm pressable" @click="confirmSku">确定</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getProductDetail } from '../../api/mall.js'
import MallHeader from '../../components/MallHeader.vue'
import { useCartStore } from '../../stores/cart.js'

const product = ref(null)
const showSku = ref(false)
const selectedSku = ref('标准收藏装')
const quantity = ref(1)
const action = ref('cart')
const skuOptions = ['标准收藏装', '礼赠雅盒', '藏家编号款']
const cart = useCartStore()

onLoad(async ({ id }) => {
  const { data } = await getProductDetail(id)
  product.value = data
})

function openSku(type) {
  action.value = type
  showSku.value = true
}

function confirmSku() {
  cart.add(product.value, selectedSku.value, quantity.value)
  showSku.value = false
  if (action.value === 'buy') uni.navigateTo({ url: '/pages/checkout/index' })
}

function goHome() { uni.reLaunch({ url: '/pages/home/index' }) }
function goBrand() { uni.navigateTo({ url: '/pages/brand/index' }) }
function goCart() { uni.navigateTo({ url: '/pages/cart/index' }) }
</script>

<style scoped lang="scss">
.detail-page { min-height: 100vh; padding-bottom: calc(118rpx + env(safe-area-inset-bottom)); background: #f4f4f2; }
.gallery { height: 750rpx; background: #e8e8e5; }
.gallery__image { width: 100%; height: 100%; }
.detail-info { padding: 28rpx 26rpx 26rpx; background: #fff; }
.detail-info__price-row { display: flex; align-items: flex-end; justify-content: space-between; }
.detail-info__currency, .detail-info__price { color: #e43a35; }
.detail-info__currency { font-size: 25rpx; }
.detail-info__price { margin-left: 4rpx; font-size: 48rpx; font-weight: 600; }
.detail-info__original { margin-left: 12rpx; color: #a3a7a5; font-size: 22rpx; text-decoration: line-through; }
.detail-info__sold { color: #939895; font-size: 23rpx; }
.detail-info__tag { display: inline-block; margin-top: 20rpx; padding: 5rpx 12rpx; border-radius: 4rpx; background: #f8e8e5; color: #d53a33; font-size: 21rpx; }
.detail-info__title { display: block; margin-top: 12rpx; color: #1e2321; font-size: 32rpx; font-weight: 600; line-height: 48rpx; }
.detail-info__benefits { display: flex; gap: 14rpx; margin-top: 22rpx; color: #78807d; font-size: 22rpx; }
.detail-panel { display: flex; min-height: 94rpx; align-items: center; gap: 20rpx; margin-top: 16rpx; padding: 0 26rpx; background: #fff; }
.detail-panel + .detail-panel { margin-top: 1rpx; }
.detail-panel__label { color: #969b99; font-size: 24rpx; }
.detail-panel__value { min-width: 0; flex: 1; color: #303633; font-size: 25rpx; }
.brand-card { display: flex; align-items: center; margin-top: 16rpx; padding: 26rpx; background: #fff; }
.brand-card__mark { display: flex; width: 86rpx; height: 86rpx; align-items: center; justify-content: center; border-radius: 8rpx; background: #0d2f2b; color: #dbb873; font-family: "STKaiti", serif; font-size: 44rpx; }
.brand-card__copy { display: flex; min-width: 0; flex: 1; flex-direction: column; margin-left: 18rpx; }
.brand-card__name { font-size: 29rpx; font-weight: 600; }
.brand-card__meta { margin-top: 7rpx; color: #8a908d; font-size: 21rpx; }
.brand-card__button { width: 116rpx; height: 62rpx; border: 1rpx solid #967044; border-radius: 31rpx; background: #fff; color: #77512d; font-size: 24rpx; line-height: 60rpx; }
.description { margin-top: 16rpx; padding: 28rpx 22rpx 70rpx; background: #fff; }
.description__heading { display: flex; justify-content: center; gap: 54rpx; padding-bottom: 24rpx; color: #8a908d; font-size: 25rpx; }
.description__heading text:first-child { position: relative; color: #162a25; font-weight: 700; }
.description__heading text:first-child::after { position: absolute; bottom: -16rpx; left: 50%; width: 40rpx; height: 4rpx; transform: translateX(-50%); background: #c99a55; content: ''; }
.description__hero { width: 100%; height: 540rpx; margin-top: 20rpx; border-radius: 6rpx; }
.description__title { display: block; margin-top: 34rpx; color: #173b34; font-family: "STKaiti", serif; font-size: 42rpx; font-weight: 700; text-align: center; }
.description__copy { display: block; margin: 18rpx 24rpx 0; color: #646c69; font-size: 26rpx; line-height: 48rpx; text-align: center; }
.description__feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 38rpx; padding: 26rpx 0; border-top: 1rpx solid #e8e4dc; border-bottom: 1rpx solid #e8e4dc; }
.description__feature-grid > view { display: flex; flex-direction: column; align-items: center; border-right: 1rpx solid #e8e4dc; color: #818784; font-size: 20rpx; }
.description__feature-grid > view:last-child { border: 0; }
.description__feature-value { margin-bottom: 8rpx; color: #8a6334; font-size: 27rpx; font-weight: 700; }
.action-bar { position: fixed; z-index: 80; right: 0; bottom: 0; left: 0; display: flex; min-height: 102rpx; align-items: center; padding: 10rpx 20rpx calc(10rpx + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -6rpx 20rpx rgba(0,0,0,.06); }
.action-bar__minor { position: relative; display: flex; width: 92rpx; flex-direction: column; align-items: center; color: #5c6461; font-size: 19rpx; }
.action-bar__badge { position: absolute; top: -10rpx; right: 10rpx; min-width: 28rpx; height: 28rpx; padding: 0 5rpx; border-radius: 14rpx; background: #e43a35; color: #fff; font-size: 17rpx; line-height: 28rpx; text-align: center; }
.action-bar__button { height: 78rpx; flex: 1; margin: 0; border-radius: 0; color: #fff; font-size: 26rpx; line-height: 78rpx; }
.action-bar__button--cart { border-radius: 39rpx 0 0 39rpx; background: #bc8a48; }
.action-bar__button--buy { border-radius: 0 39rpx 39rpx 0; background: #e43a35; }
.sheet-mask { position: fixed; z-index: 150; inset: 0; display: flex; align-items: flex-end; background: rgba(0,0,0,.52); }
.sku-sheet { width: 100%; padding: 28rpx 26rpx calc(26rpx + env(safe-area-inset-bottom)); border-radius: 20rpx 20rpx 0 0; background: #fff; animation: slide-up 220ms ease-out; }
.sku-sheet__head { position: relative; display: flex; gap: 20rpx; padding-bottom: 34rpx; }
.sku-sheet__head image { width: 180rpx; height: 180rpx; border-radius: 8rpx; }
.sku-sheet__head > view:nth-child(2) { display: flex; flex-direction: column; justify-content: flex-end; }
.sku-sheet__price { color: #e43a35; font-size: 38rpx; font-weight: 600; }
.sku-sheet__stock, .sku-sheet__selected { margin-top: 8rpx; color: #858c89; font-size: 22rpx; }
.sku-sheet__close { position: absolute; top: -12rpx; right: -8rpx; display: flex; width: 64rpx; height: 64rpx; align-items: center; justify-content: center; }
.sku-sheet__label { color: #303633; font-size: 27rpx; font-weight: 600; }
.sku-sheet__options { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 20rpx; }
.sku-sheet__option { padding: 16rpx 24rpx; border: 1rpx solid transparent; border-radius: 6rpx; background: #f4f4f2; color: #59615e; font-size: 23rpx; }
.sku-sheet__option--active { border-color: #e43a35; background: #fff2f1; color: #e43a35; }
.sku-sheet__quantity { display: flex; align-items: center; justify-content: space-between; margin-top: 46rpx; }
.stepper { display: flex; height: 62rpx; align-items: center; border: 1rpx solid #e6e7e4; border-radius: 4rpx; }
.stepper > view, .stepper > text { display: flex; width: 64rpx; height: 60rpx; align-items: center; justify-content: center; color: #525a57; font-size: 27rpx; }
.stepper > text { border-right: 1rpx solid #e6e7e4; border-left: 1rpx solid #e6e7e4; }
.sku-sheet__confirm { height: 84rpx; margin-top: 42rpx; border-radius: 42rpx; background: #e43a35; color: #fff; font-size: 28rpx; line-height: 84rpx; }
@keyframes slide-up { from { transform: translateY(24rpx); opacity: 0; } }
</style>
