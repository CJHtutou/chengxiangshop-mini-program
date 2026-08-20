import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginWechat } from '../api/mall.js'
import { isMockMode, tokenStore } from '../api/request.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(uni.getStorageSync('chengxiang-user') || null)
  const authenticated = computed(() => Boolean(tokenStore.get() && user.value))
  async function login() {
    // code 仅用于微信登录流程兼容；云函数实际身份来自可信的 CloudBase OPENID，而非前端 userId。
    let code = 'dev:mini-app-user'
    if (!isMockMode) { const loginResult = await new Promise((resolve, reject) => uni.login({ success: resolve, fail: reject })); code = loginResult.code }
    const { data } = await loginWechat(code); tokenStore.save(data.accessToken); user.value = data.user; uni.setStorageSync('chengxiang-user', data.user); return data.user
  }
  function logout() { tokenStore.clear(); user.value = null; uni.removeStorageSync('chengxiang-user') }
  return { user, authenticated, login, logout }
})
