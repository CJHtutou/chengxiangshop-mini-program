import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/theme.scss'
import { initCloudBase } from './platform/cloudbase.js'

export function createApp() {
  // #ifdef MP-WEIXIN
  initCloudBase()
  // #endif
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  return { app, pinia }
}
