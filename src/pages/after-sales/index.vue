<template>
  <view class="after-sales-page"><MallHeader title="售后服务" :show-back="true" /><view class="tabs"><text v-for="item in tabs" :key="item.key" :class="{ active: status === item.key }" @click="status = item.key">{{ item.label }}</text></view><view v-if="loading" class="state">加载中...</view><view v-else-if="items.length" class="list"><view v-for="item in items" :key="item.id" class="sale-card"><view><text>订单 {{ item.orderId }}</text><text class="status">{{ statusText(item.status) }}</text></view><text class="reason">{{ item.reason }}</text><text>退款金额 ¥{{ (item.refundCents / 100).toFixed(2) }}</text><text class="date">{{ formatDate(item.createdAt) }}</text><button v-if="item.status === 'PENDING'" @click="cancel(item)">取消申请</button></view></view><view v-else class="state">暂无售后申请</view></view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getAfterSales, cancelAfterSale } from '../../api/mall.js'
import MallHeader from '../../components/MallHeader.vue'

const status = ref(''); const items = ref([]); const loading = ref(false); const tabs = [{ key: '', label: '全部' }, { key: 'PENDING', label: '待审核' }, { key: 'APPROVED', label: '已通过' }, { key: 'REFUNDED', label: '已退款' }]
watch(status, load, { immediate: true })
async function load() { loading.value = true; try { items.value = (await getAfterSales(status.value)).data.items || [] } catch (error) { uni.showToast({ title: error.message || '售后加载失败', icon: 'none' }) } finally { loading.value = false } }
async function cancel(item) { try { await cancelAfterSale(item.id); uni.showToast({ title: '已取消申请', icon: 'success' }); load() } catch (error) { uni.showToast({ title: error.message || '取消失败', icon: 'none' }) } }
function statusText(value) { return ({ PENDING: '待审核', APPROVED: '已通过', REJECTED: '已驳回', REFUNDING: '退款中', REFUNDED: '已退款', CANCELLED: '已取消' })[value] || value }
function formatDate(value) { return value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '' }
</script>

<style scoped lang="scss">
.after-sales-page { min-height:100vh; background:#f5f5f3; }.tabs { display:flex; justify-content:space-around; background:#fff; }.tabs text { position:relative; padding:28rpx 10rpx; color:#78807d; font-size:25rpx; }.tabs text.active { color:#163b34; font-weight:700; }.tabs text.active::after { position:absolute; right:22rpx; bottom:8rpx; left:22rpx; height:4rpx; background:#e43a35; content:''; }.list { padding:18rpx; }.sale-card { display:flex; flex-direction:column; gap:16rpx; margin-bottom:16rpx; padding:24rpx; border-radius:8rpx; background:#fff; color:#53605b; font-size:24rpx; }.sale-card > view { display:flex; justify-content:space-between; color:#26342f; }.status { color:#e43a35; }.reason { color:#2e3934; font-size:28rpx; }.date { color:#929996; font-size:21rpx; }.sale-card button { width:160rpx; height:58rpx; margin:0 0 0 auto; border:1rpx solid #c8cecb; border-radius:30rpx; background:#fff; color:#65706b; font-size:22rpx; line-height:56rpx; }.state { display:flex; min-height:420rpx; align-items:center; justify-content:center; color:#929a96; font-size:25rpx; }
</style>
