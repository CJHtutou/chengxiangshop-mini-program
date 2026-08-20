<template>
  <view class="page-shell page-shell--plain brand-page">
    <MallHeader :title="content.brand?.pageTitle || `${storeConfig.storeName}品牌历程`" />
    <view class="brand-search"><SearchBar v-model="keyword" @search="search" /></view>
    <view v-if="content.brandLoading" class="state">加载品牌内容...</view>
    <view v-else-if="content.brandError && !content.brand" class="state"><text>{{ content.brandError }}</text><button @click="load">重试</button></view>
    <view v-else-if="!content.brand || !content.brand.enabled" class="state">内容暂未开放</view>
    <template v-else><FounderSection :content="content.brand" /><HistoryTimeline :content="content.brand" /><BrandFooter :slogan="content.brand.footerSlogan" /></template>
    <FloatingService />
    <BottomNav active="brand" />
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import BottomNav from '../../components/BottomNav.vue'
import FloatingService from '../../components/FloatingService.vue'
import MallHeader from '../../components/MallHeader.vue'
import SearchBar from '../../components/SearchBar.vue'
import FounderSection from '../../components/brand/FounderSection.vue'
import HistoryTimeline from '../../components/brand/HistoryTimeline.vue'
import BrandFooter from '../../components/brand/BrandFooter.vue'
import { usePageContentStore } from '../../stores/page-content.js'
import { useStoreConfigStore } from '../../stores/store-config.js'

const keyword = ref(''); const content = usePageContentStore(); const storeConfig = useStoreConfigStore()
onMounted(load)
// 品牌页只读取公开发布内容；加载失败时由 Store 保留最近一次成功缓存并提供错误状态。
async function load() { try { await content.loadBrand() } catch { /* state is rendered from store */ } }
function search() { uni.navigateTo({ url: `/pages/products/index?keyword=${encodeURIComponent(keyword.value)}` }) }
</script>

<style scoped lang="scss">
.brand-search{padding:18rpx 22rpx;background:#f6f6f5}.state{display:flex;min-height:520rpx;flex-direction:column;align-items:center;justify-content:center;gap:24rpx;color:#929a96;font-size:25rpx}.state button{width:140rpx;height:60rpx;border:1rpx solid #b8c2bd;border-radius:30rpx;background:#fff;color:#52605a;font-size:23rpx;line-height:58rpx}
</style>
