import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { syncCart } from '../api/mall.js'
import { tokenStore } from '../api/request.js'

const STORAGE_KEY = 'chengxiangshop-cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref(uni.getStorageSync(STORAGE_KEY) || [])

  const selectedItems = computed(() => items.value.filter((item) => item.selected))
  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const selectedCount = computed(() => selectedItems.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const totalPriceCents = computed(() => selectedItems.value.reduce((sum, item) => sum + (item.priceCents ?? Math.round(item.price * 100)) * item.quantity, 0))
  const allSelected = computed(() => items.value.length > 0 && items.value.every((item) => item.selected))

  function add(product, sku = '默认规格', quantity = 1, skuId = null) {
    const matched = items.value.find((item) => item.id === product.id && item.skuId === skuId)
    const maxQuantity = Number(product.stock || 0)
    if (maxQuantity <= 0) return uni.showToast({ title: '商品暂时缺货', icon: 'none' })
    if (matched) matched.quantity = Math.min(maxQuantity, matched.quantity + quantity)
    else items.value.push({ ...product, priceCents: product.priceCents ?? Math.round(product.price * 100), sku, skuId, quantity: Math.min(maxQuantity, quantity), selected: true })
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }

  function updateQuantity(index, quantity) {
    items.value[index].quantity = Math.max(1, Math.min(quantity, items.value[index].stock || 99))
  }

  function toggle(index) {
    items.value[index].selected = !items.value[index].selected
  }

  function toggleAll() {
    const next = !allSelected.value
    items.value.forEach((item) => { item.selected = next })
  }

  function remove(index) {
    items.value.splice(index, 1)
  }

  function clearSelected() {
    items.value = items.value.filter((item) => !item.selected)
  }

  let syncTimer
  watch(items, (value) => {
    uni.setStorageSync(STORAGE_KEY, value)
    // 连续增减数量只同步最后一次状态，避免每次点击都请求云函数；服务端仍是最终购物车来源。
    clearTimeout(syncTimer)
    if (tokenStore.get()) syncTimer = setTimeout(() => syncCart(value.map((item) => ({ productId: item.id, skuId: item.skuId || null, quantity: item.quantity }))).catch(() => {}), 500)
  }, { deep: true })

  return {
    items,
    selectedItems,
    totalCount,
    selectedCount,
    totalPrice,
    totalPriceCents,
    allSelected,
    add,
    updateQuantity,
    toggle,
    toggleAll,
    remove,
    clearSelected
  }
})
