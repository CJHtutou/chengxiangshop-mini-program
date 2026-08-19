<template>
  <view class="checkout-page">
    <MallHeader title="确认订单" :show-back="true" />
    <view class="address-card pressable" @click="goAddress">
      <view class="address-card__icon"><uni-icons type="location" size="25" color="#9b7038" /></view>
      <view class="address-card__copy"><view><text class="address-card__name">林墨</text><text class="address-card__phone">138****2268</text></view><text class="address-card__detail">广东省广州市白云区同德街道 西城智汇 Park 7栋</text></view>
      <uni-icons type="right" size="18" color="#a1a6a3" />
    </view>
    <view class="address-card__line" />

    <view class="order-card">
      <view class="order-card__brand"><view class="order-card__mark">羊</view><text>黑盘羊沉香堂</text></view>
      <view v-for="item in selectedItems" :key="`${item.id}-${item.sku}`" class="order-product">
        <image :src="item.image" mode="aspectFill" />
        <view class="order-product__body"><text class="order-product__title">{{ item.shortTitle || item.title }}</text><text class="order-product__sku">{{ item.sku }}</text><view><text class="order-product__price">¥{{ item.price }}</text><text class="order-product__qty">×{{ item.quantity }}</text></view></view>
      </view>
      <view class="order-row pressable"><text>配送方式</text><text>顺丰快递 · ¥0 <uni-icons type="right" size="15" color="#a0a5a3" /></text></view>
      <view class="order-row pressable"><text>店铺优惠</text><text class="order-row__accent">满1000减100 <uni-icons type="right" size="15" color="#a0a5a3" /></text></view>
      <view class="order-row"><text>订单备注</text><input v-model="note" placeholder="选填，请先和商家协商一致" /></view>
      <view class="order-card__total">共 {{ cart.selectedCount }} 件，合计 <text>¥{{ payable.toFixed(2) }}</text></view>
    </view>

    <view class="payment-card">
      <text class="payment-card__title">支付方式</text>
      <view class="payment-row pressable" @click="payment = 'wechat'"><view class="payment-row__icon payment-row__icon--wechat">W</view><text>微信支付</text><view class="radio" :class="{ 'radio--active': payment === 'wechat' }" /></view>
      <view class="payment-row pressable" @click="payment = 'balance'"><view class="payment-row__icon">¥</view><text>余额支付</text><view class="radio" :class="{ 'radio--active': payment === 'balance' }" /></view>
    </view>

    <view class="submit-bar">
      <view><text>应付：</text><text class="submit-bar__price">¥{{ payable.toFixed(2) }}</text></view>
      <button class="submit-bar__button pressable" :loading="submitting" :disabled="submitting" @click="submit">提交订单</button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import MallHeader from '../../components/MallHeader.vue'
import { useCartStore } from '../../stores/cart.js'

const cart = useCartStore()
const note = ref('')
const payment = ref('wechat')
const submitting = ref(false)
const selectedItems = computed(() => cart.selectedItems.length ? cart.selectedItems : cart.items)
const payable = computed(() => Math.max(0, cart.totalPrice - (cart.totalPrice >= 1000 ? 100 : 0)))

function goAddress() { uni.navigateTo({ url: '/pages/address/index' }) }
function submit() {
  if (!selectedItems.value.length) return uni.showToast({ title: '购物车暂无商品', icon: 'none' })
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    uni.showModal({ title: '支付成功', content: '订单已创建，商家将尽快为您备货。', showCancel: false, success: () => { cart.clearSelected(); uni.redirectTo({ url: '/pages/orders/index?status=to_ship' }) } })
  }, 700)
}
</script>

<style scoped lang="scss">
.checkout-page { min-height: 100vh; padding-bottom: calc(120rpx + env(safe-area-inset-bottom)); background: #f5f5f3; }
.address-card { display: flex; min-height: 180rpx; align-items: center; gap: 18rpx; padding: 28rpx 24rpx; background: #fff; }
.address-card__icon { display: flex; width: 66rpx; height: 66rpx; flex: 0 0 auto; align-items: center; justify-content: center; border-radius: 50%; background: #f6ecdc; }
.address-card__copy { display: flex; min-width: 0; flex: 1; flex-direction: column; }
.address-card__name { font-size: 29rpx; font-weight: 600; }
.address-card__phone { margin-left: 18rpx; color: #777e7b; font-size: 23rpx; }
.address-card__detail { margin-top: 12rpx; color: #555d5a; font-size: 24rpx; line-height: 38rpx; }
.address-card__line { height: 6rpx; background: repeating-linear-gradient(135deg, #b9874a 0, #b9874a 20rpx, #f7f0e4 20rpx, #f7f0e4 40rpx, #315c53 40rpx, #315c53 60rpx, #f7f0e4 60rpx, #f7f0e4 80rpx); }
.order-card, .payment-card { margin-top: 18rpx; padding: 24rpx; background: #fff; }
.order-card__brand { display: flex; align-items: center; gap: 12rpx; padding-bottom: 22rpx; font-size: 27rpx; font-weight: 600; }
.order-card__mark { display: flex; width: 48rpx; height: 48rpx; align-items: center; justify-content: center; border-radius: 4rpx; background: #0d2f2b; color: #d7af6b; font-family: "STKaiti", serif; }
.order-product { display: flex; gap: 18rpx; padding: 18rpx 0; border-top: 1rpx solid #f0f0ee; }
.order-product > image { width: 164rpx; height: 164rpx; flex: 0 0 auto; border-radius: 6rpx; }
.order-product__body { display: flex; min-width: 0; flex: 1; flex-direction: column; }
.order-product__title { display: -webkit-box; overflow: hidden; font-size: 25rpx; line-height: 38rpx; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.order-product__sku { align-self: flex-start; margin-top: 9rpx; padding: 6rpx 9rpx; background: #f3f3f1; color: #919694; font-size: 20rpx; }
.order-product__body > view { display: flex; justify-content: space-between; margin-top: auto; }
.order-product__price { color: #e43a35; font-size: 28rpx; }
.order-product__qty { color: #848a87; font-size: 22rpx; }
.order-row { display: flex; min-height: 86rpx; align-items: center; justify-content: space-between; border-top: 1rpx solid #f0f0ee; color: #4b5350; font-size: 24rpx; }
.order-row input { flex: 1; margin-left: 30rpx; text-align: right; font-size: 23rpx; }
.order-row__accent { color: #d43a34; }
.order-card__total { padding-top: 22rpx; border-top: 1rpx solid #f0f0ee; font-size: 23rpx; text-align: right; }
.order-card__total text { color: #e43a35; font-size: 31rpx; }
.payment-card__title { display: block; padding-bottom: 12rpx; font-size: 28rpx; font-weight: 600; }
.payment-row { display: flex; height: 92rpx; align-items: center; gap: 16rpx; border-top: 1rpx solid #f0f0ee; font-size: 25rpx; }
.payment-row__icon { display: flex; width: 48rpx; height: 48rpx; align-items: center; justify-content: center; border-radius: 50%; background: #e9e1d4; color: #8b6335; font-weight: 700; }
.payment-row__icon--wechat { background: #24af55; color: #fff; }
.payment-row > text { flex: 1; }
.radio { width: 38rpx; height: 38rpx; border: 2rpx solid #c8ccca; border-radius: 50%; }
.radio--active { border: 11rpx solid #e43a35; }
.submit-bar { position: fixed; z-index: 80; right: 0; bottom: 0; left: 0; display: flex; align-items: center; justify-content: flex-end; gap: 24rpx; padding: 12rpx 20rpx calc(12rpx + env(safe-area-inset-bottom)); background: #fff; font-size: 24rpx; }
.submit-bar__price { color: #e43a35; font-size: 34rpx; }
.submit-bar__button { width: 230rpx; height: 80rpx; margin: 0; border-radius: 40rpx; background: #e43a35; color: #fff; font-size: 27rpx; line-height: 80rpx; }
</style>
