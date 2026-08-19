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

  function add(product, sku = '默认规格', quantity = 1) {
    const matched = items.value.find((item) => item.id === product.id && item.sku === sku)
    if (matched) matched.quantity += quantity
    else items.value.push({ ...product, priceCents: product.priceCents ?? Math.round(product.price * 100), sku, quantity, selected: true })
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
