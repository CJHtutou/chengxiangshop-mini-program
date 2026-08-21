<template>
  <view class="nav">
    <view
      v-for="item in navItems"
      :key="item.key"
      class="nav__item pressable"
      :class="{ 'nav__item--active': active === item.key }"
      @click="go(item)"
    >
      <view class="nav__icon-wrap">
        <uni-icons :type="item.icon" size="25" :color="active === item.key ? '#e43a35' : '#616966'" />
        <text v-if="item.key === 'cart' && cart.totalCount" class="nav__badge">{{ cart.totalCount }}</text>
      </view>
      <text class="nav__label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup>
import { useCartStore } from '../stores/cart.js'

const props = defineProps({ active: { type: String, required: true } })
const cart = useCartStore()
const navItems = [
  { key: 'home', label: '首页', icon: 'home', url: '/pages/home/index' },
  { key: 'brand', label: '品牌历程', icon: 'flag', url: '/pages/brand/index' },
  { key: 'products', label: '全部商品', icon: 'shop', url: '/pages/products/index' },
  { key: 'cart', label: '购物车', icon: 'cart', url: '/pages/cart/index' },
  { key: 'profile', label: '个人中心', icon: 'person', url: '/pages/profile/index' }
]

function go(item) {
  if (item.key === props.active) return
  uni.switchTab({ url: item.url })
}
</script>

<style scoped lang="scss">
.nav {
  position: fixed;
  z-index: 60;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  min-height: 106rpx;
  padding: 10rpx 4rpx calc(8rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #e9e9e7;
  background: rgba(255, 255, 255, 0.98);
}

.nav__item {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rpx;
  color: #545c59;
}

.nav__icon-wrap {
  position: relative;
  display: flex;
  width: 56rpx;
  height: 52rpx;
  align-items: center;
  justify-content: center;
}

.nav__label {
  width: 100%;
  overflow: hidden;
  font-size: 22rpx;
  line-height: 32rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav__item--active .nav__label {
  color: #e43a35;
  font-weight: 600;
}

.nav__badge {
  position: absolute;
  top: -4rpx;
  right: -8rpx;
  min-width: 30rpx;
  height: 30rpx;
  padding: 0 6rpx;
  border: 3rpx solid #fff;
  border-radius: 17rpx;
  background: #e43a35;
  color: #fff;
  font-size: 18rpx;
  line-height: 30rpx;
  text-align: center;
}
</style>
