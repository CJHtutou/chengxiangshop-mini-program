<template>
  <view class="service pressable" @click="contact">
    <uni-icons type="chatbubble" size="28" color="#171b1a" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStoreConfigStore } from '../stores/store-config.js'

const storeConfig = useStoreConfigStore()
const contactText = computed(() => {
  const lines = []
  if (storeConfig.config.serviceHours) lines.push(`客服时间：${storeConfig.config.serviceHours}`)
  if (storeConfig.config.phone) lines.push(`联系电话：${storeConfig.config.phone}`)
  if (storeConfig.config.serviceWechat) lines.push(`客服微信：${storeConfig.config.serviceWechat}`)
  return lines.join('\n') || '客服信息暂未配置'
})
function contact() {
  uni.showModal({
    title: '在线客服',
    content: contactText.value,
    confirmText: '知道了',
    showCancel: false
  })
}
</script>

<style scoped lang="scss">
.service {
  position: fixed;
  z-index: 70;
  right: 24rpx;
  bottom: calc(142rpx + env(safe-area-inset-bottom));
  display: flex;
  width: 88rpx;
  height: 88rpx;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #e4e4e1;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 12rpx 28rpx rgba(16, 31, 27, 0.16);
}
</style>
