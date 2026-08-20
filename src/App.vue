<script>
import { useStoreConfigStore } from './stores/store-config.js'
export default {
  onLaunch() {
    // 仅预热可公开的商城配置；失败时 Store 回退到安全默认值，页面仍可显示错误状态。
    useStoreConfigStore().load()
  },
  onShow() {
    useStoreConfigStore().load(true)
  }
}
</script>

<style lang="scss">
page {
  min-height: 100%;
  background: #f5f5f3;
  color: #171b1a;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}

view,
text,
image,
button,
input,
swiper,
scroll-view {
  box-sizing: border-box;
}

button::after {
  border: none;
}
</style>
