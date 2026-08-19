<template>
  <view class="search-bar pressable" @click="focusInput">
    <uni-icons type="search" size="22" color="#8a918f" />
    <input
      ref="inputRef"
      class="search-bar__input"
      :value="modelValue"
      :focus="focused"
      confirm-type="search"
      placeholder="搜索商品"
      placeholder-class="search-bar__placeholder"
      @input="$emit('update:modelValue', $event.detail.value)"
      @confirm="$emit('search')"
      @blur="focused = false"
    />
    <view v-if="modelValue" class="search-bar__clear" @click.stop="$emit('update:modelValue', '')">
      <uni-icons type="clear" size="20" color="#9ca19f" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ modelValue: { type: String, default: '' } })
defineEmits(['update:modelValue', 'search'])
const focused = ref(false)

function focusInput() {
  focused.value = true
}
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  height: 76rpx;
  align-items: center;
  gap: 12rpx;
  padding: 0 24rpx;
  border: 1rpx solid rgba(27, 37, 34, 0.04);
  border-radius: 38rpx;
  background: #fff;
}

.search-bar__input {
  min-width: 0;
  height: 76rpx;
  flex: 1;
  color: #252b29;
  font-size: 28rpx;
}

.search-bar__placeholder {
  color: #9aa09e;
}

.search-bar__clear {
  display: flex;
  width: 52rpx;
  height: 52rpx;
  align-items: center;
  justify-content: center;
}
</style>
