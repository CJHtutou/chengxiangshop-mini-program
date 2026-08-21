<template>
  <view class="page-shell orders-page">
    <MallHeader title="我的订单" :show-back="true" />
    <scroll-view class="order-tabs" scroll-x :show-scrollbar="false">
      <view class="order-tabs__inner"><view v-for="item in tabs" :key="item.key" class="order-tab pressable" :class="{ 'order-tab--active': status === item.key }" @click="status = item.key">{{ item.label }}</view></view>
    </scroll-view>
    <view v-if="loading" class="loading-orders"><uni-icons type="spinner-cycle" size="42" color="#b88544" /></view>
    <view v-else-if="filteredOrders.length" class="orders-list">
      <view v-for="order in filteredOrders" :key="order.id" class="order-card pressable" @click="openOrder(order.id)">
        <view class="order-card__head"><text>订单号：{{ order.displayNo }}</text><text class="order-card__status">{{ order.status }}</text></view>
        <view class="order-card__body"><view v-if="getThumbs(order).length" class="order-card__thumbs"><image v-for="(product, index) in getThumbs(order)" :key="product.id || index" :src="imgUrl(product.image, 126)" mode="aspectFill" lazy-load /></view><text v-else class="order-card__no-image">暂无商品图片</text><view class="order-card__summary"><text>{{ order.items }} 件商品</text><text class="order-card__amount">实付 <text>¥{{ order.amount.toFixed(2) }}</text></text></view></view>
        <view class="order-card__foot"><text>{{ order.createdAt }}</text><button class="order-card__button pressable" @click.stop="order.statusKey === 'to_pay' ? pay(order) : openOrder(order.id)">{{ order.statusKey === 'to_pay' ? '去付款' : '查看详情' }}</button></view>
      </view>
    </view>
    <view v-else-if="error" class="empty-orders"><uni-icons type="info" size="52" color="#c4c9c6" /><text>{{ error }}</text><button @click="load">重试</button></view>
    <view v-else class="empty-orders"><uni-icons type="paperplane" size="52" color="#c4c9c6" /><text>这里还没有订单</text></view>
    <view v-if="loadingMore" class="loading-more">正在加载更多...</view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { createPayment, getOrders } from '../../api/mall.js'
import MallHeader from '../../components/MallHeader.vue'
import { imgUrl } from '../../utils/image.js'

const status = ref('all')
const orders = ref([])
const loading = ref(true)
const error = ref('')
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const tabs = [{ key: 'all', label: '全部' }, { key: 'to_pay', label: '待付款' }, { key: 'to_ship', label: '待发货' }, { key: 'to_receive', label: '待收货' }, { key: 'completed', label: '已完成' }]
const filteredOrders = computed(() => status.value === 'all' ? orders.value : orders.value.filter((order) => order.statusKey === status.value))

onLoad(async ({ status: initialStatus }) => { if (initialStatus) status.value = initialStatus; await load() })
watch(status, () => { load() })
async function load(reset = true) { if (reset) { page.value = 1; hasMore.value = true; loading.value = true; error.value = '' } else { if (!hasMore.value || loadingMore.value) return; loadingMore.value = true } const orderStatus = status.value === 'all' ? '' : status.value === 'to_pay' ? 'PENDING_PAYMENT' : status.value === 'to_ship' ? 'TO_SHIP' : status.value === 'to_receive' ? 'SHIPPED' : 'COMPLETED'; try { const result = await getOrders(orderStatus, { page: page.value, pageSize: 10 }); const incoming = result.data.items || []; orders.value = reset ? incoming : orders.value.concat(incoming); const pagination = result.data.pagination || {}; hasMore.value = page.value < Number(pagination.pages || Math.ceil(Number(pagination.total || 0) / 10)); if (incoming.length < 10) hasMore.value = false; page.value += 1 } catch (reason) { if (reset) error.value = reason.message || '订单加载失败' } finally { loading.value = false; loadingMore.value = false } }
function getThumbs(order) { return (order.itemsData || []).filter((item) => item.image).slice(0, 2) }
function openOrder(id) { uni.navigateTo({ url: `/pages/order-detail/index?id=${id}` }) }
async function pay(order) { try { const { data } = await createPayment(order.id); if (typeof uni.requestPayment !== 'function') throw new Error('当前客户端不支持微信支付'); const paymentData = data?.payment || data; await new Promise((resolve, reject) => uni.requestPayment({ ...paymentData, success: resolve, fail: reject })); uni.showToast({ title: '支付成功', icon: 'success' }); await load() } catch (error) { if (error?.errMsg?.includes('cancel')) return; uni.showToast({ title: error.message || '支付未完成，订单仍保留待付款', icon: 'none' }) } }
onReachBottom(() => load(false))
</script>

<style scoped lang="scss">
.orders-page { background: #f5f5f3; }
.order-tabs { background: #fff; white-space: nowrap; }
.order-tabs__inner { display: inline-flex; width: 100%; justify-content: space-around; }
.order-tab { position: relative; min-width: 124rpx; height: 88rpx; color: #7f8784; font-size: 25rpx; line-height: 88rpx; text-align: center; }
.order-tab--active { color: #1d2925; font-weight: 700; }
.order-tab--active::after { position: absolute; bottom: 10rpx; left: 50%; width: 44rpx; height: 5rpx; transform: translateX(-50%); border-radius: 3rpx; background: #e43a35; content: ''; }
.orders-list { padding: 18rpx; }
.order-card { margin-bottom: 16rpx; padding: 22rpx; border-radius: 8rpx; background: #fff; }
.order-card__head, .order-card__foot { display: flex; justify-content: space-between; color: #8c9390; font-size: 21rpx; }
.order-card__status { color: #e43a35; }
.order-card__body { display: flex; align-items: center; padding: 22rpx 0; }
.order-card__thumbs { display: flex; gap: 10rpx; }
.order-card__thumbs image { width: 126rpx; height: 126rpx; border-radius: 6rpx; }
.order-card__no-image { color: #8d9591; font-size: 22rpx; }
.order-card__summary { display: flex; flex: 1; flex-direction: column; align-items: flex-end; color: #727a77; font-size: 23rpx; }
.order-card__amount { margin-top: 14rpx; }
.order-card__amount > text { color: #e43a35; font-size: 31rpx; }
.order-card__foot { align-items: center; padding-top: 18rpx; border-top: 1rpx solid #f0f0ee; }
.order-card__button { width: 168rpx; height: 58rpx; margin: 0; border: 1rpx solid #bdc2bf; border-radius: 30rpx; background: #fff; color: #454e4a; font-size: 22rpx; line-height: 56rpx; }
.empty-orders { display: flex; min-height: 620rpx; flex-direction: column; align-items: center; justify-content: center; color: #a1a7a4; font-size: 25rpx; }
.empty-orders text { margin-top: 20rpx; }
.empty-orders button { width: 160rpx; height: 60rpx; margin-top: 20rpx; border-radius: 30rpx; background: #e43a35; color: #fff; font-size: 22rpx; line-height: 60rpx; }.loading-orders { display:flex; min-height:480rpx; align-items:center; justify-content:center; }
</style>
