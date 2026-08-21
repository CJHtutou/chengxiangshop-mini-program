<template>
  <view class="page-shell cart-page">
    <MallHeader title="购物车" />

    <view v-if="cart.items.length" class="cart-list">
      <view v-for="(item, index) in cart.items" :key="`${item.id}-${item.sku}`" class="cart-item">
        <view class="checkbox pressable" :class="{ 'checkbox--active': item.selected }" @click="cart.toggle(index)">
          <uni-icons v-if="item.selected" type="checkmarkempty" size="17" color="#ffffff" />
        </view>
        <image class="cart-item__image" :src="imgUrl(item.image, 180)" mode="aspectFill" lazy-load @click="openProduct(item.id)" />
        <view class="cart-item__body">
          <text class="cart-item__title" @click="openProduct(item.id)">{{ item.shortTitle || item.title }}</text>
          <text class="cart-item__sku">{{ item.sku }}</text>
          <view class="cart-item__bottom">
            <text class="cart-item__price price-number">¥{{ item.price }}</text>
            <view class="stepper"><view class="pressable" @click="cart.updateQuantity(index, item.quantity - 1)">−</view><text>{{ item.quantity }}</text><view class="pressable" @click="cart.updateQuantity(index, item.quantity + 1)">＋</view></view>
          </view>
        </view>
        <view class="cart-item__remove pressable" @click="remove(index)"><uni-icons type="trash" size="20" color="#a2a7a5" /></view>
      </view>
    </view>

    <view v-else class="empty-cart">
      <view class="empty-cart__icon"><uni-icons type="shop" size="66" color="#d1d4d2" /></view>
      <text class="empty-cart__title">购物车还是空的</text>
      <text class="empty-cart__copy">遇见喜欢的香品，就把它留下吧</text>
      <button class="empty-cart__button pressable" @click="goProducts">查看商品</button>
    </view>

    <view class="recommend-title"><view /><text>推荐商品</text><view /></view>
    <view class="product-grid">
      <ProductCard v-for="product in recommendations" :key="product.id" :product="product" />
    </view>

    <view v-if="cart.items.length" class="checkout-bar">
      <view class="checkout-bar__select pressable" @click="cart.toggleAll">
        <view class="checkbox" :class="{ 'checkbox--active': cart.allSelected }"><uni-icons v-if="cart.allSelected" type="checkmarkempty" size="17" color="#fff" /></view>
        <text>全选</text>
      </view>
      <view class="checkout-bar__summary"><text>合计：</text><text class="checkout-bar__price price-number">¥{{ cart.totalPrice.toFixed(2) }}</text><text class="checkout-bar__freight">不含运费</text></view>
      <button class="checkout-bar__button pressable" :disabled="!cart.selectedCount" @click="checkout">结算({{ cart.selectedCount }})</button>
    </view>

    <BottomNav active="cart" />
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getProducts } from '../../api/mall.js'
import BottomNav from '../../components/BottomNav.vue'
import MallHeader from '../../components/MallHeader.vue'
import ProductCard from '../../components/ProductCard.vue'
import { useCartStore } from '../../stores/cart.js'
import { imgUrl } from '../../utils/image.js'

const cart = useCartStore()
const recommendations = ref([])
onMounted(async () => { try { const { data } = await getProducts({ page: 1, pageSize: 4, sort: 'sold' }); recommendations.value = data.items } catch { recommendations.value = [] } })

function openProduct(id) { uni.navigateTo({ url: `/pages/product-detail/index?id=${id}` }) }
function goProducts() { uni.navigateTo({ url: '/pages/products/index' }) }
function checkout() { uni.navigateTo({ url: '/pages/checkout/index' }) }
function remove(index) {
  uni.showModal({ title: '移除商品', content: '确认从购物车移除这件商品吗？', success: ({ confirm }) => { if (confirm) cart.remove(index) } })
}
</script>

<style scoped lang="scss">
.cart-page { background: #f5f5f3; }
.cart-list { padding: 18rpx; }
.cart-item { position: relative; display: flex; align-items: center; gap: 16rpx; margin-bottom: 16rpx; padding: 20rpx; border-radius: 8rpx; background: #fff; }
.checkbox { display: flex; width: 38rpx; height: 38rpx; flex: 0 0 auto; align-items: center; justify-content: center; border: 2rpx solid #c9cdcb; border-radius: 50%; }
.checkbox--active { border-color: #e43a35; background: #e43a35; }
.cart-item__image { width: 180rpx; height: 180rpx; flex: 0 0 auto; border-radius: 6rpx; background: #eee; }
.cart-item__body { display: flex; min-width: 0; align-self: stretch; flex: 1; flex-direction: column; }
.cart-item__title { display: -webkit-box; overflow: hidden; color: #29302d; font-size: 27rpx; line-height: 39rpx; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.cart-item__sku { align-self: flex-start; margin-top: 10rpx; padding: 7rpx 10rpx; border-radius: 3rpx; background: #f4f4f2; color: #898f8c; font-size: 20rpx; }
.cart-item__bottom { display: flex; align-items: flex-end; justify-content: space-between; margin-top: auto; }
.cart-item__price { color: #e43a35; font-size: 30rpx; }
.stepper { display: flex; height: 52rpx; align-items: center; border: 1rpx solid #e5e6e3; }
.stepper > view, .stepper > text { display: flex; width: 54rpx; height: 50rpx; align-items: center; justify-content: center; color: #525956; font-size: 24rpx; }
.stepper > text { border-right: 1rpx solid #e5e6e3; border-left: 1rpx solid #e5e6e3; }
.cart-item__remove { position: absolute; top: 12rpx; right: 12rpx; display: flex; width: 52rpx; height: 52rpx; align-items: center; justify-content: center; }
.empty-cart { display: flex; min-height: 600rpx; flex-direction: column; align-items: center; justify-content: center; }
.empty-cart__icon { display: flex; width: 170rpx; height: 170rpx; align-items: center; justify-content: center; border-radius: 50%; background: #f0f1ef; }
.empty-cart__title { margin-top: 22rpx; color: #59605e; font-size: 29rpx; }
.empty-cart__copy { margin-top: 10rpx; color: #a0a5a3; font-size: 23rpx; }
.empty-cart__button { width: 230rpx; height: 76rpx; margin-top: 34rpx; border-radius: 38rpx; background: #e11513; color: #fff; font-size: 27rpx; line-height: 76rpx; }
.recommend-title { display: flex; align-items: center; justify-content: center; gap: 18rpx; padding: 30rpx 0 22rpx; color: #969c99; font-size: 27rpx; }
.recommend-title view { width: 70rpx; height: 1rpx; background: #d9dcda; }
.product-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16rpx; padding: 0 20rpx 36rpx; }
.checkout-bar { position: fixed; z-index: 65; right: 0; bottom: calc(106rpx + env(safe-area-inset-bottom)); left: 0; display: flex; min-height: 98rpx; align-items: center; padding: 10rpx 16rpx; background: #fff; box-shadow: 0 -4rpx 18rpx rgba(0,0,0,.05); }
.checkout-bar__select { display: flex; align-items: center; gap: 10rpx; color: #555d5a; font-size: 23rpx; }
.checkout-bar__summary { display: flex; min-width: 0; flex: 1; flex-wrap: wrap; align-items: baseline; justify-content: flex-end; margin: 0 16rpx; font-size: 23rpx; }
.checkout-bar__price { color: #e43a35; font-size: 32rpx; font-weight: 600; }
.checkout-bar__freight { width: 100%; color: #9ca19f; font-size: 18rpx; text-align: right; }
.checkout-bar__button { width: 210rpx; height: 76rpx; border-radius: 38rpx; background: #e43a35; color: #fff; font-size: 26rpx; line-height: 76rpx; }
.checkout-bar__button[disabled] { opacity: .45; }
</style>
