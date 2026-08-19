import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getStoreConfig } from '../api/mall.js'

const CACHE_KEY = 'chengxiang-store-config'
const CACHE_TTL = 5 * 60 * 1000
export const safeStoreConfig = { version: 0, name: '商城', subtitle: '品质生活', logoUrl: '', iconUrl: '', description: '', phone: '', serviceWechat: '', serviceHours: '', address: '', businessOpen: true, banners: [] }

export const useStoreConfigStore = defineStore('store-config', () => {
  const config = ref({ ...safeStoreConfig })
  const loading = ref(false)
  const error = ref('')
  const loaded = ref(false)
  const storeName = computed(() => config.value.name || safeStoreConfig.name)
  const storeMark = computed(() => storeName.value.slice(0, 1))
  function readCache() { const cached = uni.getStorageSync(CACHE_KEY); if (cached?.data && Date.now() - cached.savedAt < CACHE_TTL) { config.value = { ...safeStoreConfig, ...cached.data }; loaded.value = true; return true } return false }
  async function load(force = false) {
    if (!force && (loaded.value || readCache())) return config.value
    loading.value = true; error.value = ''
    try { const { data } = await getStoreConfig(); config.value = { ...safeStoreConfig, ...data }; loaded.value = true; uni.setStorageSync(CACHE_KEY, { savedAt: Date.now(), data: config.value }); setNavigationTitle() }
    catch (reason) { error.value = reason.message || '商城配置加载失败'; readCache(); if (!loaded.value) config.value = { ...safeStoreConfig } }
    finally { loading.value = false }
    return config.value
  }
  function setNavigationTitle(title = storeName.value) { try { uni.setNavigationBarTitle({ title }) } catch { /* custom navigation pages can ignore this */ } }
  return { config, loading, error, loaded, storeName, storeMark, load, setNavigationTitle }
})
