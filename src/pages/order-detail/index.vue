<template>
  <view v-if="order" class="order-detail-page">
    <MallHeader title="订单详情" :show-back="true" />
    <view class="status-banner"><uni-icons :type="order.statusKey === 'to_receive' ? 'truck' : 'paperplane'" size="31" color="#ecd4a7" /><view><text>{{ order.status }}</text><text>{{ statusCopy }}</text></view></view>
    <view class="detail-address"><uni-icons type="location" size="24" color="#a47a42" /><view v-if="order.addressSnapshot"><text>{{ addressReceiver }}</text><text>{{ addressDetail }}</text></view><text v-else class="empty-text">未保存收货地址快照</text></view>
    <view class="detail-order-card"><view class="detail-order-card__head"><text>{{ storeConfig.storeName }}</text><text>{{ order.items }} 件商品</text></view><view v-for="item in order.orderItems" :key="item.id" class="detail-order-product"><image v-if="item.image" :src="imgUrl(item.image, 150)" mode="aspectFill" lazy-load /><view v-else class="detail-order-product__placeholder">暂无图片</view><view><text>{{ item.title }}</text><text>{{ item.skuNameSnapshot || '默认规格' }} × {{ item.quantity }}</text><text>¥{{ (item.totalCents / 100).toFixed(2) }}</text></view></view><view v-if="!order.orderItems.length" class="empty-order-items">订单没有商品明细</view><view class="detail-order-total">商品总价 <text>¥{{ order.amount.toFixed(2) }}</text></view></view>
    <view class="info-card"><view><text>订单编号</text><text>{{ order.displayNo }}</text></view><view><text>创建时间</text><text>{{ order.createdAt }}</text></view><view><text>支付状态</text><text>{{ order.statusKey === 'to_pay' ? '待付款' : '已支付或由服务端更新' }}</text></view></view>
    <view class="detail-actions"><button class="pressable" :disabled="!canAfterSale" @click="afterSales">申请售后</button><button class="detail-actions__primary pressable" @click="contact">查看物流</button></view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { getOrderDetail } from '../../api/mall.js'
import MallHeader from '../../components/MallHeader.vue'
import { useStoreConfigStore } from '../../stores/store-config.js'
import { imgUrl } from '../../utils/image.js'

const order = ref(null)
const storeConfig = useStoreConfigStore()
onLoad(async ({ id }) => { try { order.value = (await getOrderDetail(id)).data } catch (error) { uni.showToast({ title: error.message || '订单加载失败', icon: 'none' }) } })
const addressReceiver = computed(() => order.value?.addressSnapshot ? [order.value.addressSnapshot.receiverName, order.value.addressSnapshot.phone].filter(Boolean).join(' ') : '')
const addressDetail = computed(() => order.value?.addressSnapshot ? [order.value.addressSnapshot.province, order.value.addressSnapshot.city, order.value.addressSnapshot.district, order.value.addressSnapshot.detail].filter(Boolean).join('') : '')
const statusCopy = computed(() => ({ to_pay: '请在付款截止时间前完成支付', to_ship: '商家将按订单状态安排发货', to_receive: '商品已发出，请留意物流信息', completed: '订单已完成', cancelled: '订单已取消' })[order.value?.statusKey] || '订单状态由服务端同步')
const canAfterSale = computed(() => ['to_ship', 'to_receive', 'completed'].includes(order.value?.statusKey))
function contact() { if (!order.value?.carrier || !order.value?.trackingNo) return uni.showToast({ title: '暂无物流信息', icon: 'none' }); uni.showModal({ title: '物流信息', content: `${order.value.carrier}\n${order.value.trackingNo}`, showCancel: false }) }
function afterSales() { if (!canAfterSale.value) return uni.showToast({ title: '当前订单暂不支持售后', icon: 'none' }); uni.navigateTo({ url: `/pages/after-sales/index?orderId=${order.value.id}` }) }
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
.detail-order-product__placeholder { display: flex; width: 150rpx; height: 150rpx; align-items: center; justify-content: center; border-radius: 6rpx; background: #eff1ef; color: #8e9692; font-size: 20rpx; }.empty-order-items, .empty-text { color: #8e9692; font-size: 22rpx; }.empty-order-items { padding: 42rpx 0; text-align: center; }
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
