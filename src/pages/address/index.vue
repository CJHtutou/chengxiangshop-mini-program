<template>
  <view class="address-page">
    <MallHeader title="地址管理" :show-back="true" />
    <view class="address-list"><view class="address-item"><view class="address-item__head"><text>林墨</text><text>138****2268</text><text class="address-item__tag">默认</text></view><text class="address-item__detail">广东省广州市白云区同德街道 西城智汇 Park 7栋</text><view class="address-item__actions"><text @click="edit">编辑</text><text @click="remove">删除</text></view></view><view class="address-item"><view class="address-item__head"><text>陈女士</text><text>139****6612</text></view><text class="address-item__detail">广东省惠州市惠城区演达大道香文化街</text><view class="address-item__actions"><text @click="edit">编辑</text><text @click="remove">删除</text></view></view></view>
    <button class="address-add pressable" @click="add"><uni-icons type="plusempty" size="20" color="#fff" /> 新增收货地址</button>
  </view>
</template>

<script setup>
import MallHeader from '../../components/MallHeader.vue'
function edit() { uni.showToast({ title: '地址编辑为模拟功能', icon: 'none' }) }
function remove() { uni.showModal({ title: '删除地址', content: '确认删除这条收货地址吗？', success: ({ confirm }) => { if (confirm) uni.showToast({ title: '已删除', icon: 'success' }) } }) }
function add() { uni.showToast({ title: '新增地址为模拟功能', icon: 'none' }) }
</script>

<style scoped lang="scss">
.address-page { min-height: 100vh; padding-bottom: 140rpx; background: #f5f5f3; }
.address-list { padding: 20rpx; }
.address-item { margin-bottom: 16rpx; padding: 28rpx 24rpx; border-radius: 8rpx; background: #fff; }
.address-item__head { display: flex; align-items: center; gap: 22rpx; color: #303835; font-size: 27rpx; }
.address-item__tag { padding: 4rpx 9rpx; border-radius: 3rpx; background: #f9e3e0; color: #e43a35; font-size: 19rpx; }
.address-item__detail { display: block; margin-top: 18rpx; color: #606864; font-size: 24rpx; line-height: 38rpx; }
.address-item__actions { display: flex; justify-content: flex-end; gap: 36rpx; margin-top: 22rpx; padding-top: 18rpx; border-top: 1rpx solid #f0f0ee; color: #7c847f; font-size: 23rpx; }
.address-add { position: fixed; right: 28rpx; bottom: calc(34rpx + env(safe-area-inset-bottom)); left: 28rpx; height: 84rpx; border-radius: 42rpx; background: #e43a35; color: #fff; font-size: 28rpx; line-height: 84rpx; }
</style>
