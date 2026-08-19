<script>
import { useStoreConfigStore } from './stores/store-config.js'
export default {
  onLaunch() {
    useStoreConfigStore().load()
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
