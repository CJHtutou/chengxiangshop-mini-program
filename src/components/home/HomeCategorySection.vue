<template><view class="section category-section"><view v-if="section.title" class="section-title">{{ section.title }}</view><view v-if="categories.length" class="category-grid"><view v-for="category in categories" :key="category.id" class="category pressable" @click="$emit('open-category', category.id)"><image v-if="category.imageUrl" class="category__image" :src="imgUrl(category.imageUrl, 92)" mode="aspectFill" lazy-load /><view v-else class="category__icon"><uni-icons :type="category.icon" size="27" color="#0d2f2b" /></view><text class="category__name">{{ category.name }}</text></view></view><view v-else class="empty">暂无分类</view></view></template>
<script setup>
import { imgUrl } from '../../utils/image.js'

defineProps({ section: { type: Object, required: true }, categories: { type: Array, default: () => [] } })
defineEmits(['open-category'])
</script>
<style scoped lang="scss">.section{padding:28rpx 22rpx}.section-title{margin-bottom:18rpx;color:#26342f;font-size:32rpx;font-weight:700}.category-section{background:#fff}.category-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20rpx 8rpx}.category{display:flex;min-width:0;flex-direction:column;align-items:center}.category__icon,.category__image{width:92rpx;height:92rpx;border-radius:50%;background:#eef2ef}.category__icon{display:flex;align-items:center;justify-content:center}.category__image{object-fit:cover}.category__name{margin-top:12rpx;color:#39413e;font-size:23rpx}.empty{padding:20rpx;color:#929a96;font-size:24rpx;text-align:center}</style>
