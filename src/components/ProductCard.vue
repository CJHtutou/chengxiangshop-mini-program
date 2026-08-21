<template>
  <view class="product-card pressable" @click="openDetail">
    <image v-if="imageSrc" class="product-card__image" :src="imageSrc" mode="aspectFill" lazy-load @error="imageFailed = true" /><view v-else class="product-card__image product-card__image--empty">暂无图片</view>
    <view class="product-card__body">
      <text class="product-card__title">{{ product.title }}</text>
      <text class="product-card__rank">{{ product.rank }}</text>
      <view class="product-card__footer">
        <view>
          <text class="product-card__currency">¥</text>
          <text class="product-card__price price-number">{{ formatPrice(product.price) }}</text>
          <text class="product-card__sold">已售{{ product.sold }}</text>
        </view>
        <view class="product-card__cart" @click.stop="quickAdd">
          <uni-icons type="cart" size="23" color="#e43a35" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { imgUrl } from '../utils/image.js'

const props = defineProps({ product: { type: Object, required: true } })
const cart = useCartStore()
const imageFailed = ref(false)
const imageSrc = computed(() => imageFailed.value ? '' : imgUrl(props.product.image, 360))

function formatPrice(price) {
  return Number.isInteger(price) ? price : price.toFixed(1)
}

function openDetail() {
  uni.navigateTo({ url: `/pages/product-detail/index?id=${props.product.id}` })
}

function quickAdd() {
  if (props.product.skus?.some((item) => item.status !== 'DISABLED')) return openDetail()
  cart.add(props.product)
}
</script>

<style scoped lang="scss">
.product-card {
  overflow: hidden;
  border-radius: 10rpx;
  background: #fff;
}

.product-card__image {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1.04;
  background: #e9ece8;
}
.product-card__image--empty { display: flex; align-items: center; justify-content: center; color: #89918d; font-size: 22rpx; }

.product-card__body {
  padding: 16rpx 16rpx 18rpx;
}

.product-card__title {
  display: -webkit-box;
  min-height: 80rpx;
  overflow: hidden;
  color: #202523;
  font-size: 28rpx;
  line-height: 40rpx;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-card__rank {
  display: block;
  margin-top: 6rpx;
  color: #e43a35;
  font-size: 23rpx;
  line-height: 34rpx;
}

.product-card__footer {
  display: flex;
  min-height: 52rpx;
  align-items: center;
  justify-content: space-between;
  margin-top: 4rpx;
}

.product-card__currency,
.product-card__price {
  color: #e43a35;
}

.product-card__currency {
  margin-right: 3rpx;
  font-size: 22rpx;
}

.product-card__price {
  font-size: 34rpx;
}

.product-card__sold {
  margin-left: 8rpx;
  color: #8b918e;
  font-size: 21rpx;
}

.product-card__cart {
  display: flex;
  width: 56rpx;
  height: 56rpx;
  align-items: center;
  justify-content: center;
}
</style>
