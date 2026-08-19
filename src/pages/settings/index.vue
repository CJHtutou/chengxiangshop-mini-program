<template>
  <view class="settings-page"><MallHeader title="设置" :show-back="true" /><view class="settings-list"><view v-for="item in items" :key="item.label" class="settings-row pressable"><text>{{ item.label }}</text><text class="settings-row__value">{{ item.value }} <uni-icons type="right" size="17" color="#a0a6a3" /></text></view></view><button class="logout pressable" @click="logout">退出登录</button></view>
</template>

<script setup>
import MallHeader from '../../components/MallHeader.vue'
const items = [{ label: '账号与安全', value: '' }, { label: '消息通知', value: '已开启' }, { label: '隐私设置', value: '' }, { label: '关于黑盘羊', value: 'v1.0.0' }]
function logout() { uni.showModal({ title: '退出登录', content: '确认退出当前账号吗？', success: ({ confirm }) => { if (confirm) uni.reLaunch({ url: '/pages/home/index' }) } }) }
</script>

<style scoped lang="scss">
.settings-page { min-height: 100vh; background: #f5f5f3; }
.settings-list { margin-top: 18rpx; padding: 0 24rpx; background: #fff; }
.settings-row { display: flex; min-height: 100rpx; align-items: center; justify-content: space-between; border-bottom: 1rpx solid #f0f0ee; color: #36403c; font-size: 27rpx; }
.settings-row:last-child { border: 0; }
.settings-row__value { color: #8a928e; font-size: 23rpx; }
.logout { height: 82rpx; margin: 54rpx 24rpx; border: 1rpx solid #e43a35; border-radius: 41rpx; background: #fff; color: #e43a35; font-size: 27rpx; line-height: 80rpx; }
</style>
