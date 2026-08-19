<template>
  <view class="header safe-top">
    <view class="header__bar">
      <view v-if="showBack" class="header__action pressable" @click="back">
        <uni-icons type="left" size="24" color="#171b1a" />
      </view>
      <view v-else class="header__action pressable" @click="goHome">
        <uni-icons type="home" size="24" color="#171b1a" />
      </view>
      <text class="header__title">{{ displayTitle }}</text>
      <view class="header__capsule">
        <uni-icons type="more-filled" size="20" color="#171b1a" />
        <view class="header__divider" />
        <view class="header__circle" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStoreConfigStore } from '../stores/store-config.js'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: false }
})
const storeConfig = useStoreConfigStore()
const displayTitle = computed(() => props.title || storeConfig.storeName)

function back() {
  const pages = getCurrentPages()
  if (pages.length > 1) uni.navigateBack()
  else uni.reLaunch({ url: '/pages/home/index' })
}

function goHome() {
  uni.reLaunch({ url: '/pages/home/index' })
}
</script>

<style scoped lang="scss">
.header {
  background: #fff;
}

.header__bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 104rpx;
  padding: 0 20rpx;
}

.header__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border: 1rpx solid #e8e8e8;
  border-radius: 36rpx;
}

.header__title {
  position: absolute;
  left: 120rpx;
  right: 210rpx;
  overflow: hidden;
  color: #111;
  font-size: 34rpx;
  font-weight: 600;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header__capsule {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 184rpx;
  height: 64rpx;
  border: 1rpx solid #dedede;
  border-radius: 32rpx;
}

.header__divider {
  width: 1rpx;
  height: 34rpx;
  background: #d7d7d7;
}

.header__circle {
  width: 24rpx;
  height: 24rpx;
  border: 6rpx solid #171b1a;
  border-radius: 50%;
}
</style>
