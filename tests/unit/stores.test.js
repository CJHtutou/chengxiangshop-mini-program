import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCartStore } from '../../src/stores/cart.js'
import { useStoreConfigStore } from '../../src/stores/store-config.js'
import { useMarketingPopupStore } from '../../src/stores/marketing-popup.js'

const storage = new Map()
globalThis.uni = { getStorageSync: vi.fn((key) => storage.get(key)), setStorageSync: vi.fn((key, value) => storage.set(key, value)), removeStorageSync: vi.fn((key) => storage.delete(key)), setNavigationBarTitle: vi.fn(), showToast: vi.fn() }

describe('Pinia commerce stores', () => {
  beforeEach(() => { storage.clear(); setActivePinia(createPinia()) })
  it('hydrates fresh store configuration from cache', async () => { storage.set('chengxiang-store-config', { savedAt: Date.now(), data: { name: '缓存商城', subtitle: 'CACHE' } }); const store = useStoreConfigStore(); await store.load(); expect(store.storeName).toBe('缓存商城') })
  it('calculates cart totals in integer cents', () => { const cart = useCartStore(); cart.add({ id: 'p1', title: '商品', price: 38.8, priceCents: 3880, stock: 10 }, '默认', 2); expect(cart.totalPriceCents).toBe(7760); expect(cart.totalCount).toBe(2) })
  it('keeps popup campaign records keyed by popup id and version', async () => { const popup = useMarketingPopupStore(); await popup.load(); expect(popup.popup.id).toBeTruthy(); await popup.close(); expect(storage.get(`chengxiang-marketing-popup:${popup.popup.id}`).version).toBe(popup.popup.version) })
})
