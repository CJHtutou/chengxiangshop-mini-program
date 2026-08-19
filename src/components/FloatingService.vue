<template>
  <view class="service pressable" @click="contact">
    <uni-icons type="chatbubble" size="28" color="#171b1a" />
  </view>
</template>

<script setup>
function contact() {
  uni.showModal({
    title: '在线客服',
    content: '客服在线时间 09:00-22:00\n联系电话：15625056161',
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
