import { ref } from 'vue'
import { defineStore } from 'pinia'
import { claimPopupCoupon, getActivePopup, reportPopupClose, reportPopupImpression } from '../api/marketing.js'

const keyFor = (id) => `chengxiang-marketing-popup:${id}`
const today = () => new Date().toISOString().slice(0, 10)
export const useMarketingPopupStore = defineStore('marketing-popup', () => {
  const popup = ref(null); const visible = ref(false); const loading = ref(false); const error = ref('')
  function canShow(item) { const state = uni.getStorageSync(keyFor(item.id)) || {}; if (state.version !== item.version) return true; if (item.displayRule === 'EVERY_VISIT') return true; if (item.displayRule === 'ONCE_PER_DAY') return state.day !== today(); if (item.displayRule === 'ONCE_PER_CAMPAIGN') return false; return !state.claimed }
  async function load() { loading.value = true; error.value = ''; try { const { data } = await getActivePopup(); popup.value = data; if (!data || !canShow(data)) { visible.value = false; return null } const delay = Math.max(0, Number(data.displayDelaySeconds || 0)) * 1000; if (delay) await new Promise((resolve) => setTimeout(resolve, delay)); if (popup.value?.id === data.id) { visible.value = true; reportPopupImpression(data.id).catch(() => {}) }; return data } catch (reason) { error.value = reason.message || '营销活动加载失败'; visible.value = false; return null } finally { loading.value = false } }
  async function close() { if (!popup.value) return; const current = popup.value; uni.setStorageSync(keyFor(current.id), { version: current.version, day: today(), claimed: false, closedAt: Date.now() }); visible.value = false; await reportPopupClose(current.id).catch(() => {}) }
  async function claim() { if (!popup.value) throw new Error('活动不存在'); const coupon = await claimPopupCoupon(popup.value.id); uni.setStorageSync(keyFor(popup.value.id), { version: popup.value.version, day: today(), claimed: true, claimedAt: Date.now() }); visible.value = false; return coupon.data }
  return { popup, visible, loading, error, load, close, claim }
})
