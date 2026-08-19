<template>
  <view class="page-shell page-shell--plain brand-page">
    <MallHeader title="黑盘羊品牌历程" />
    <view class="brand-search"><SearchBar v-model="keyword" @search="search" /></view>

    <view class="founder">
      <image class="founder__image" src="/static/images/founder.jpg" mode="aspectFill" />
      <view class="founder__scrim" />
      <view class="founder__content">
        <text class="founder__name">老羊</text>
        <text class="founder__role">黑盘羊沉香创始人</text>
        <text class="founder__copy">高端奇楠 / 沉香收藏家\n惠州市香文化协会执行会长\n上合组织传统香文化讲师</text>
        <text class="founder__quote">“不追逐短暂的热闹，只认真做好每一炉香。”</text>
      </view>
    </view>

    <view class="timeline">
      <view class="section-title">
        <text class="section-title__eyebrow">BRAND HISTORY</text>
        <text class="section-title__main">守香十九年</text>
      </view>
      <view v-for="item in history" :key="item.year" class="timeline__item">
        <view class="timeline__year">{{ item.year }}</view>
        <view class="timeline__dot" />
        <view class="timeline__content">
          <text class="timeline__title">{{ item.title }}</text>
          <text class="timeline__copy">{{ item.copy }}</text>
        </view>
      </view>
    </view>

    <view class="brand-footer">
      <text class="brand-footer__mark">黑盘羊</text>
      <text class="brand-footer__en">ARGAL 2006</text>
      <text class="brand-footer__slogan">专注野生沉香十九年</text>
      <text class="brand-footer__address">广州黑盘羊总部 · 白云区同德街道西城智汇</text>
      <text class="brand-footer__phone">联系电话：15625056161</text>
    </view>

    <FloatingService />
    <BottomNav active="brand" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import BottomNav from '../../components/BottomNav.vue'
import FloatingService from '../../components/FloatingService.vue'
import MallHeader from '../../components/MallHeader.vue'
import SearchBar from '../../components/SearchBar.vue'

const keyword = ref('')
const history = [
  { year: '2006', title: '因香结缘', copy: '从一块海南老料开始，建立以真实产区和自然香韵为核心的收藏标准。' },
  { year: '2012', title: '走访产区', copy: '深入海南、惠安与加里曼丹等传统产区，建立稳定、可追溯的原材渠道。' },
  { year: '2018', title: '香文化讲堂', copy: '将沉香知识带到茶会、雅集与公开课堂，让收藏不再玄奥。' },
  { year: '2026', title: '一炉香的新旅程', copy: '以线上商城连接更多香友，坚持天然、真材、长期主义。' }
]

function search() {
  uni.navigateTo({ url: `/pages/products/index?keyword=${encodeURIComponent(keyword.value)}` })
}
</script>

<style scoped lang="scss">
.brand-search { padding: 18rpx 22rpx; background: #f6f6f5; }
.founder { position: relative; height: 650rpx; overflow: hidden; background: #020504; }
.founder__image { width: 100%; height: 100%; opacity: .66; }
.founder__scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,.16), rgba(0,0,0,.88)); }
.founder__content { position: absolute; top: 70rpx; right: 40rpx; width: 53%; color: #ead2a6; }
.founder__name { display: block; font-family: "STKaiti", serif; font-size: 56rpx; font-weight: 700; }
.founder__role { display: block; margin-top: 6rpx; font-size: 24rpx; }
.founder__copy { display: block; margin-top: 30rpx; font-size: 25rpx; line-height: 46rpx; }
.founder__quote { display: block; margin-top: 32rpx; color: #fff; font-family: "STKaiti", serif; font-size: 28rpx; line-height: 46rpx; }
.timeline { padding: 58rpx 30rpx 54rpx; background: #f7f3ed; }
.section-title { margin-bottom: 42rpx; text-align: center; }
.section-title__eyebrow { display: block; color: #9b7644; font-size: 20rpx; }
.section-title__main { display: block; margin-top: 10rpx; color: #153c34; font-family: "STKaiti", serif; font-size: 46rpx; font-weight: 700; }
.timeline__item { display: grid; grid-template-columns: 100rpx 30rpx 1fr; min-height: 174rpx; }
.timeline__year { color: #a67d43; font-size: 28rpx; font-weight: 700; }
.timeline__dot { position: relative; width: 18rpx; height: 18rpx; margin-top: 10rpx; border: 5rpx solid #f7f3ed; border-radius: 50%; background: #a67d43; box-shadow: 0 0 0 2rpx #a67d43; }
.timeline__dot::after { position: absolute; top: 22rpx; left: 6rpx; width: 2rpx; height: 135rpx; background: #d9c6a6; content: ''; }
.timeline__item:last-child .timeline__dot::after { display: none; }
.timeline__title { display: block; color: #163d35; font-size: 30rpx; font-weight: 700; }
.timeline__copy { display: block; margin-top: 10rpx; color: #686f6c; font-size: 24rpx; line-height: 40rpx; }
.brand-footer { display: flex; flex-direction: column; align-items: center; padding: 82rpx 30rpx 70rpx; background: #0d3b34; color: #dbba7c; }
.brand-footer__mark { font-family: "STKaiti", serif; font-size: 58rpx; font-weight: 700; }
.brand-footer__en { margin-top: 6rpx; font-size: 19rpx; letter-spacing: 4rpx; }
.brand-footer__slogan { margin-top: 32rpx; font-size: 28rpx; letter-spacing: 2rpx; }
.brand-footer__address, .brand-footer__phone { margin-top: 32rpx; font-size: 21rpx; text-align: center; }
.brand-footer__phone { margin-top: 8rpx; }
</style>
