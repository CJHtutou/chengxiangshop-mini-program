<template>
  <view v-if="visible" class="coupon-modal" @click.self="$emit('close')">
    <view class="coupon-modal__ticket">
      <text class="coupon-modal__scope">店铺全部商品可用</text>
      <text class="coupon-modal__limit">限领 1 张</text>
      <view class="coupon-modal__amount">
        <text class="coupon-modal__currency">¥</text>
        <text class="coupon-modal__number price-number">100</text>
      </view>
      <text class="coupon-modal__condition">(满1000可用)</text>
      <view class="coupon-modal__line" />
      <button class="coupon-modal__claim pressable" @click="$emit('claim')">立即领取</button>
    </view>
    <view class="coupon-modal__close pressable" @click="$emit('close')">
      <uni-icons type="closeempty" size="30" color="#ffffff" />
    </view>
  </view>
</template>

<script setup>
defineProps({ visible: Boolean })
defineEmits(['close', 'claim'])
</script>

<style scoped lang="scss">
.coupon-modal {
  position: fixed;
  z-index: 200;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  background: rgba(8, 13, 12, 0.68);
}

.coupon-modal__ticket {
  position: relative;
  display: flex;
  width: min(610rpx, 88vw);
  min-height: 620rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 54rpx 38rpx 34rpx;
  border-radius: 18rpx;
  background: #ffe7b9;
  color: #74440d;
  box-shadow: 0 28rpx 70rpx rgba(0, 0, 0, 0.28);
}

.coupon-modal__ticket::before,
.coupon-modal__ticket::after {
  position: absolute;
  top: 70%;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #19201e;
  content: '';
}

.coupon-modal__ticket::before { left: -22rpx; }
.coupon-modal__ticket::after { right: -22rpx; }
.coupon-modal__scope { font-size: 38rpx; font-weight: 600; }
.coupon-modal__limit { margin-top: 28rpx; font-size: 26rpx; }
.coupon-modal__amount { display: flex; align-items: flex-end; margin-top: 6rpx; }
.coupon-modal__currency { padding-bottom: 28rpx; font-size: 30rpx; }
.coupon-modal__number { font-size: 168rpx; font-weight: 700; line-height: 1; }
.coupon-modal__condition { margin-top: 8rpx; font-size: 34rpx; }
.coupon-modal__line { width: 100%; margin: 28rpx 0 12rpx; border-top: 2rpx dashed #805728; }
.coupon-modal__claim { width: 100%; background: transparent; color: #f05a2a; font-size: 38rpx; font-weight: 700; }
.coupon-modal__close { display: flex; width: 68rpx; height: 68rpx; align-items: center; justify-content: center; margin-top: 44rpx; border: 3rpx solid #fff; border-radius: 50%; }
</style>
