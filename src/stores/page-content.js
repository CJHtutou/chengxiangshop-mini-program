import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getBrandPageContent, getHomePageContent } from '../api/content.js'

const HOME_CACHE = 'chengxiang-page-content-home'
const BRAND_CACHE = 'chengxiang-page-content-brand'
// 发布内容短暂缓存以改善首屏；强制刷新会绕过缓存，失败时只回退最近一次成功数据。
const CACHE_TTL = 5 * 60 * 1000
function readCache(key) { const cached = uni.getStorageSync(key); return cached?.data ? cached : null }

export const usePageContentStore = defineStore('page-content', () => {
  const home = ref(null); const brand = ref(null); const homeLoading = ref(false); const brandLoading = ref(false); const homeError = ref(''); const brandError = ref('')
  const homeSections = computed(() => [...(home.value?.sections || [])].filter((item) => item.enabled).sort((a, b) => a.sort - b.sort))
  // 公开接口只返回云函数已发布快照；本地不保存草稿，也不负责判断发布状态。
  async function loadHome(force = false) { const cached = readCache(HOME_CACHE); if (!force && cached && Date.now() - cached.savedAt < CACHE_TTL) { home.value = cached.data; return home.value } homeLoading.value = true; homeError.value = ''; try { const { data } = await getHomePageContent(); if (!data) throw new Error('首页内容暂未发布'); home.value = data; uni.setStorageSync(HOME_CACHE, { savedAt: Date.now(), data }); return home.value } catch (error) { homeError.value = error.message || '首页内容加载失败'; if (cached) { home.value = cached.data; return home.value } throw error } finally { homeLoading.value = false } }
  async function loadBrand(force = false) { const cached = readCache(BRAND_CACHE); if (!force && cached && Date.now() - cached.savedAt < CACHE_TTL) { brand.value = cached.data; return brand.value } brandLoading.value = true; brandError.value = ''; try { const { data } = await getBrandPageContent(); if (!data) { brand.value = null; return null } brand.value = data; uni.setStorageSync(BRAND_CACHE, { savedAt: Date.now(), data }); return brand.value } catch (error) { brandError.value = error.message || '品牌内容加载失败'; if (cached) { brand.value = cached.data; return brand.value } throw error } finally { brandLoading.value = false } }
  return { home, brand, homeLoading, brandLoading, homeError, brandError, homeSections, loadHome, loadBrand }
})
