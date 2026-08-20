import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/theme.scss'
import { initCloudBase } from './platform/cloudbase.js'

export function createApp() {
  // wx.cloud 仅由微信基础库提供；H5 预览没有该运行时，不能在跨端入口无条件初始化。
  // #ifdef MP-WEIXIN
  initCloudBase()
  // #endif
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  return { app, pinia }
}
