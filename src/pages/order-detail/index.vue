<template>
  <view class="order-detail-page">
    <MallHeader title="订单详情" :show-back="true" />
    <view class="status-banner"><uni-icons :type="order.statusKey === 'to_receive' ? 'truck' : 'paperplane'" size="31" color="#ecd4a7" /><view><text>{{ order.status }}</text><text>{{ order.statusKey === 'to_ship' ? '商家将于48小时内发货' : '包裹正在向你赶来' }}</text></view></view>
    <view class="detail-address"><uni-icons type="location" size="24" color="#a47a42" /><view><text>林墨 138****2268</text><text>广东省广州市白云区同德街道 西城智汇 Park 7栋</text></view></view>
    <view class="detail-order-card"><view class="detail-order-card__head"><text>{{ storeConfig.storeName }}</text><text>{{ order.items }} 件商品</text></view><view v-for="item in order.itemsData?.length ? order.itemsData : [{ image: '/static/images/product-car.jpg', title: '天然沉香收藏香品' }]" :key="item.title" class="detail-order-product"><image :src="item.image || '/static/images/product-incense.jpg'" mode="aspectFill" /><view><text>{{ item.title }}</text><text>标准收藏装 × {{ order.items }}</text><text>¥{{ order.amount.toFixed(2) }}</text></view></view><view class="detail-order-total">商品总价 <text>¥{{ order.amount.toFixed(2) }}</text></view></view>
    <view class="info-card"><view><text>订单编号</text><text>{{ order.id }}</text></view><view><text>创建时间</text><text>{{ order.createdAt }}</text></view><view><text>支付方式</text><text>微信支付</text></view></view>
    <view class="detail-actions"><button class="pressable" @click="afterSales">申请售后</button><button class="detail-actions__primary pressable" @click="contact">查看物流</button></view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getOrderDetail } from '../../api/mall.js'
import MallHeader from '../../components/MallHeader.vue'
import { useStoreConfigStore } from '../../stores/store-config.js'

const order = ref({ status: '加载中', statusKey: 'to_ship', amount: 0, items: 0 })
const storeConfig = useStoreConfigStore()
onLoad(async ({ id }) => { try { order.value = (await getOrderDetail(id)).data } catch (error) { uni.showToast({ title: error.message || '订单加载失败', icon: 'none' }) } })
function contact() { uni.showToast({ title: '物流信息已更新', icon: 'success' }) }
function afterSales() { uni.navigateTo({ url: '/pages/after-sales/index' }) }
</script>

<style scoped lang="scss">
.order-detail-page { min-height: 100vh; padding-bottom: 130rpx; background: #f5f5f3; }
.status-banner { display: flex; align-items: center; gap: 20rpx; padding: 34rpx 28rpx; background: #0d3b34; color: #fff; }
.status-banner > view { display: flex; flex-direction: column; }
.status-banner > view > text:first-child { color: #eed5a5; font-size: 31rpx; font-weight: 700; }
.status-banner > view > text:last-child { margin-top: 8rpx; color: #b9cec6; font-size: 21rpx; }
.detail-address { display: flex; gap: 18rpx; padding: 28rpx; background: #fff; }
.detail-address > view { display: flex; flex-direction: column; }
.detail-address > view text:first-child { color: #303936; font-size: 26rpx; }
.detail-address > view text:last-child { margin-top: 10rpx; color: #737b77; font-size: 22rpx; line-height: 34rpx; }
.detail-order-card, .info-card { margin-top: 18rpx; padding: 26rpx; background: #fff; }
.detail-order-card__head, .detail-order-total, .info-card view { display: flex; align-items: center; justify-content: space-between; color: #505956; font-size: 24rpx; }
.detail-order-product { display: flex; gap: 18rpx; margin-top: 22rpx; padding: 18rpx 0; border-top: 1rpx solid #efefed; }
.detail-order-product image { width: 150rpx; height: 150rpx; border-radius: 6rpx; }
.detail-order-product > view { display: flex; flex: 1; flex-direction: column; }
.detail-order-product > view text:nth-child(1) { color: #333b37; font-size: 25rpx; }
.detail-order-product > view text:nth-child(2) { margin-top: 12rpx; color: #929895; font-size: 21rpx; }
.detail-order-product > view text:nth-child(3) { margin-top: auto; color: #e43a35; font-size: 29rpx; }
.detail-order-total { padding-top: 20rpx; border-top: 1rpx solid #efefed; }
.detail-order-total text { color: #e43a35; font-size: 31rpx; }
.info-card view { min-height: 66rpx; border-bottom: 1rpx solid #f0f0ee; }
.info-card view:last-child { border: 0; }
.info-card view text:first-child { color: #929895; }
.info-card view text:last-child { color: #404a46; }
.detail-actions { position: fixed; right: 0; bottom: 0; left: 0; display: flex; gap: 16rpx; padding: 14rpx 22rpx calc(14rpx + env(safe-area-inset-bottom)); background: #fff; }
.detail-actions button { height: 78rpx; flex: 1; margin: 0; border: 1rpx solid #bec3c1; border-radius: 39rpx; background: #fff; color: #4d5652; font-size: 26rpx; line-height: 76rpx; }
.detail-actions__primary { border: 0 !important; background: #e43a35 !important; color: #fff !important; }
</style>
