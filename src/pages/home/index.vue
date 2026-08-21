<template>
  <view class="page-shell home-page">
    <MallHeader />
    <view class="home-top"><SearchBar v-model="keyword" @search="search" /></view>
    <view v-if="loadError" class="network-state"><text>{{ loadError }}</text><button class="pressable" @click="loadHome">重试</button></view>
    <view v-else-if="loading" class="state">加载首页内容...</view>
    <view v-else-if="!sections.length" class="state"><text>首页内容暂未开放</text><button class="pressable" @click="loadHome(true)">重新加载</button></view>
    <template v-else>
      <HomeBannerSection :items="bannerSections" @navigate="navigate" />
      <template v-for="section in content.homeSections" :key="section.id">
        <HomeProofSection v-if="section.type === 'BRAND_PROOF'" :section="section" />
        <HomeCategorySection v-else-if="section.type === 'CATEGORY_NAV'" :section="section" :categories="categoriesFor(section)" @open-category="openCategory" />
        <HomePromotionSection v-else-if="section.type === 'PROMOTION'" :section="section" @navigate="navigate" />
        <HomeBrandStorySection v-else-if="section.type === 'BRAND_STORY'" :section="section" @navigate="navigate" />
        <HomeRecommendedSection v-else-if="section.type === 'RECOMMENDED_PRODUCTS'" :section="section" :products="productsFor(section)" @navigate="navigate" />
      </template>
    </template>
    <FloatingService />
    <BottomNav active="home" />
    <MarketingPopup :visible="marketing.visible" :popup="marketing.popup" @close="closePopup" @claim="claimPopup" @navigate="navigate" />
  </view>
</template>

<script setup>
import { onShareAppMessage } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import BottomNav from '../../components/BottomNav.vue'
import FloatingService from '../../components/FloatingService.vue'
import MallHeader from '../../components/MallHeader.vue'
import SearchBar from '../../components/SearchBar.vue'
import MarketingPopup from '../../components/marketing/MarketingPopup.vue'
import HomeBannerSection from '../../components/home/HomeBannerSection.vue'
import HomeProofSection from '../../components/home/HomeProofSection.vue'
import HomeCategorySection from '../../components/home/HomeCategorySection.vue'
import HomePromotionSection from '../../components/home/HomePromotionSection.vue'
import HomeBrandStorySection from '../../components/home/HomeBrandStorySection.vue'
import HomeRecommendedSection from '../../components/home/HomeRecommendedSection.vue'
import { getCategories, getProducts } from '../../api/mall.js'
import { useMarketingPopupStore } from '../../stores/marketing-popup.js'
import { usePageContentStore } from '../../stores/page-content.js'

const keyword = ref(''); const categories = ref([]); const products = ref([]); const loadError = ref(''); const loading = ref(true)
const content = usePageContentStore(); const marketing = useMarketingPopupStore()
onShareAppMessage(() => ({ title: '商城首页', path: '/pages/home/index' }))
const sections = computed(() => content.homeSections)
const bannerSections = computed(() => sections.value.filter((item) => item.type === 'BANNER'))
// 下拉刷新同时绕过首页缓存、更新分类/商品，并重新判断当前有效营销弹窗。
async function loadHome(force = false) { loading.value = true; loadError.value = ''; try { const [, categoryResult, productResult] = await Promise.all([content.loadHome(force), getCategories(), getProducts({ page: 1, pageSize: 20, sort: 'sold' })]); categories.value = categoryResult.data || []; products.value = productResult.data.items || []; await marketing.load() } catch (error) { loadError.value = error.message || '网络异常，请稍后重试' } finally { loading.value = false } }
onMounted(() => loadHome())
onPullDownRefresh(async () => { await loadHome(true); uni.stopPullDownRefresh() })
function search() { uni.navigateTo({ url: `/pages/products/index?keyword=${encodeURIComponent(keyword.value)}` }) }
function categoriesFor(section) { const ids = section.config?.categoryIds; return Array.isArray(ids) && ids.length ? categories.value.filter((item) => ids.includes(item.id)) : categories.value }
function productsFor(section) { const ids = section.config?.productIds; return Array.isArray(ids) && ids.length ? ids.map((id) => products.value.find((item) => item.id === id)).filter(Boolean) : products.value.slice(0, 6) }
function openCategory(id) { uni.navigateTo({ url: `/pages/products/index?category=${id}` }) }
function navigate(section) { if (!section || section.linkType === 'none') return; if (section.linkType === 'brand') { uni.navigateTo({ url: '/pages/brand/index' }); return } if (section.linkType === 'products') { uni.navigateTo({ url: '/pages/products/index' }); return } if (section.linkType === 'product' && section.linkTarget) { uni.navigateTo({ url: `/pages/product-detail/index?id=${section.linkTarget}` }); return } if (section.linkType === 'category' && section.linkTarget) openCategory(section.linkTarget) }
async function closePopup() { await marketing.close() }
async function claimPopup() { try { await marketing.claim(); uni.showToast({ title: '优惠券领取成功', icon: 'success' }) } catch (error) { uni.showToast({ title: error.message || '领取失败', icon: 'none' }) } }
</script>

<style scoped lang="scss">
.home-page{background:#f5f5f3}.home-top{padding:18rpx 22rpx 22rpx;background:#f5f5f3}.network-state{display:flex;min-height:80rpx;align-items:center;justify-content:space-between;padding:14rpx 22rpx;background:#fff2f1;color:#a53b35;font-size:23rpx}.network-state button,.state button{width:140rpx;height:58rpx;margin:0;border:1rpx solid #c85b54;border-radius:29rpx;background:#fff;color:#a53b35;font-size:22rpx;line-height:56rpx}.state{display:flex;min-height:420rpx;flex-direction:column;align-items:center;justify-content:center;gap:24rpx;color:#929a96;font-size:25rpx}
</style>
