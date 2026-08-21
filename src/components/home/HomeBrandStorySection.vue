<template><view class="story-card pressable" @click="$emit('navigate', section)"><image v-if="section.image" class="story-card__image" :src="imgUrl(section.image, 750)" mode="aspectFill" lazy-load /><view v-else class="story-card__image story-card__image--empty" /><view class="story-card__scrim" /><view class="story-card__content"><text class="story-card__eyebrow">{{ section.config?.eyebrow || '品牌故事' }}</text><text class="story-card__title">{{ section.title }}</text><text class="story-card__link">{{ section.subtitle || '了解品牌历程' }}</text></view></view></template>
<script setup>
import { imgUrl } from '../../utils/image.js'

defineProps({ section: { type: Object, required: true } })
defineEmits(['navigate'])
</script>
<style scoped lang="scss">.story-card{position:relative;height:360rpx;margin:22rpx;overflow:hidden;border-radius:8rpx}.story-card__image{width:100%;height:100%}.story-card__image--empty{background:#1d4038}.story-card__scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,31,27,.92),rgba(7,31,27,.28))}.story-card__content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:40rpx;color:#fff}.story-card__eyebrow{color:#dcb875;font-size:22rpx}.story-card__title{width:70%;margin-top:16rpx;font-family:"STKaiti",serif;font-size:42rpx;line-height:1.45}.story-card__link{margin-top:28rpx;color:#ead8b8;font-size:24rpx}</style>
