<template>
  <view class="page-shell profile-page">
    <MallHeader title="个人中心" />
    <view class="profile-hero">
      <view class="profile-hero__texture" />
      <view class="profile-user">
        <view class="profile-user__avatar">{{ auth.user?.nickname?.slice(0, 1) || storeConfig.storeMark }}</view>
        <view class="profile-user__copy"><text class="profile-user__greet">{{ auth.authenticated ? auth.user.nickname : '点击登录查看会员权益' }}</text><text class="profile-user__hint">登录后订单管理更轻松，优惠信息不错过</text></view>
        <button v-if="!auth.authenticated" class="profile-user__login pressable" @click="login">登录</button>
      </view>
      <view class="member-card">
        <view><text class="member-card__name">{{ storeConfig.storeName }}</text><text class="member-card__meta">{{ storeConfig.config.subtitle || '商城服务' }}</text></view>
        <uni-icons type="right" size="20" color="#ecd2a3" />
      </view>
    </view>

    <view class="order-panel">
      <view class="panel-heading"><text>我的订单</text><text class="panel-heading__link pressable" @click="goOrders">查看全部订单 <uni-icons type="right" size="16" color="#a2a7a4" /></text></view>
      <view class="order-entry-grid">
        <view v-for="item in orderEntries" :key="item.key" class="order-entry pressable" @click="goOrders(item.key)"><view class="order-entry__icon"><uni-icons :type="item.icon" size="26" color="#173d35" /></view><text>{{ item.label }}</text></view>
      </view>
    </view>

    <view class="menu-panel">
      <view v-for="item in menus" :key="item.label" class="menu-row pressable" @click="goMenu(item)" ><view class="menu-row__icon"><uni-icons :type="item.icon" size="25" color="#244a42" /></view><text>{{ item.label }}</text><text v-if="item.extra" class="menu-row__extra">{{ item.extra }}</text><uni-icons type="right" size="17" color="#a0a6a3" /></view>
    </view>

    <FloatingService />
    <BottomNav active="profile" />
  </view>
</template>

<script setup>
import BottomNav from '../../components/BottomNav.vue'
import FloatingService from '../../components/FloatingService.vue'
import MallHeader from '../../components/MallHeader.vue'
import { useAuthStore } from '../../stores/auth.js'
import { useStoreConfigStore } from '../../stores/store-config.js'

const auth = useAuthStore()
const storeConfig = useStoreConfigStore()

const orderEntries = [
  { key: 'to_pay', label: '待付款', icon: 'wallet' },
  { key: 'to_ship', label: '待发货', icon: 'paperplane' },
  { key: 'to_receive', label: '待收货', icon: 'truck' },
  { key: 'completed', label: '已完成', icon: 'chat' },
  { key: 'after_sale', label: '退款/售后', icon: 'help' }
]
const menus = [
  { label: '购物车', icon: 'cart', url: '/pages/cart/index' },
  { label: '地址管理', icon: 'location', url: '/pages/address/index' },
  { label: '设置', icon: 'settings', url: '/pages/settings/index' }
]

async function login() { try { await auth.login(); uni.showToast({ title: '登录成功', icon: 'success' }) } catch (error) { uni.showToast({ title: error.message || '登录失败', icon: 'none' }) } }
function goOrders(status = '') { uni.navigateTo({ url: `/pages/orders/index${status ? `?status=${status}` : ''}` }) }
function goMenu(item) { if (item.url) uni.navigateTo({ url: item.url }) }
</script>

<style scoped lang="scss">
.profile-page { background: #f5f5f3; }
.profile-hero { position: relative; min-height: 416rpx; overflow: hidden; padding: 54rpx 24rpx 26rpx; background: linear-gradient(135deg, #dfc198, #a8784b); }
.profile-hero__texture { position: absolute; inset: 0; opacity: .28; background: repeating-linear-gradient(120deg, rgba(255,255,255,.35) 0, rgba(255,255,255,.35) 2rpx, transparent 2rpx, transparent 13rpx); }
.profile-user, .member-card { position: relative; z-index: 1; }
.profile-user { display: flex; align-items: center; }
.profile-user__avatar { display: flex; width: 132rpx; height: 132rpx; align-items: center; justify-content: center; border: 3rpx solid rgba(255,255,255,.8); border-radius: 50%; background: #e6e9ed; color: #75839a; font-size: 58rpx; }
.profile-user__copy { display: flex; min-width: 0; flex: 1; flex-direction: column; margin-left: 22rpx; }
.profile-user__greet { color: #2d302f; font-size: 31rpx; font-weight: 700; }
.profile-user__hint { margin-top: 12rpx; color: #5d5348; font-size: 21rpx; line-height: 34rpx; }
.profile-user__login { width: 112rpx; height: 62rpx; margin: 0; border-radius: 4rpx; background: #e43a35; color: #fff; font-size: 25rpx; line-height: 62rpx; }
.member-card { display: flex; align-items: center; justify-content: space-between; margin-top: 42rpx; padding: 28rpx 26rpx; border-radius: 16rpx 16rpx 0 0; background: #23253d; color: #fff; }
.member-card__name { display: block; font-size: 26rpx; }
.member-card__meta { display: block; margin-top: 8rpx; color: #c9cad7; font-size: 20rpx; }
.assets-grid { display: grid; grid-template-columns: repeat(5, 1fr); padding: 30rpx 10rpx; background: #fff; }
.asset { display: flex; flex-direction: column; align-items: center; }
.asset__value { color: #2d3532; font-size: 29rpx; }
.asset__label { margin-top: 10rpx; color: #656d6a; font-size: 21rpx; }
.order-panel, .menu-panel { margin-top: 18rpx; padding: 28rpx 24rpx; background: #fff; }
.panel-heading { display: flex; align-items: center; justify-content: space-between; color: #25312d; font-size: 29rpx; }
.panel-heading__link { color: #a0a6a3; font-size: 22rpx; }
.order-entry-grid { display: grid; grid-template-columns: repeat(5, 1fr); margin-top: 30rpx; }
.order-entry { position: relative; display: flex; flex-direction: column; align-items: center; }
.order-entry__icon { display: flex; height: 54rpx; align-items: center; }
.order-entry > text:not(.order-entry__badge) { margin-top: 8rpx; color: #4e5753; font-size: 21rpx; }
.order-entry__badge { position: absolute; top: -10rpx; right: 12rpx; min-width: 28rpx; height: 28rpx; padding: 0 5rpx; border-radius: 15rpx; background: #e43a35; color: #fff; font-size: 17rpx; line-height: 28rpx; text-align: center; }
.menu-panel { padding: 0 24rpx; }
.menu-row { display: flex; min-height: 98rpx; align-items: center; border-bottom: 1rpx solid #f0f0ee; }
.menu-row:last-child { border: 0; }
.menu-row__icon { display: flex; width: 56rpx; align-items: center; }
.menu-row > text:not(.menu-row__extra) { flex: 1; color: #3d4642; font-size: 27rpx; }
.menu-row__extra { margin-right: 18rpx; color: #a57843; font-size: 21rpx; }
</style>
