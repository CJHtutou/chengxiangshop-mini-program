<template>
  <view class="address-page">
    <MallHeader title="地址管理" :show-back="true" />
    <view v-if="error" class="error-state"><text>{{ error }}</text><button class="pressable" @click="load">重试</button></view>
    <view v-else-if="addresses.length" class="address-list"><view v-for="item in addresses" :key="item.id" class="address-item">
      <view class="address-item__head"><text>{{ item.receiverName }}</text><text>{{ item.phone }}</text><text v-if="item.isDefault" class="address-item__tag">默认</text></view>
      <text class="address-item__detail">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</text>
      <view class="address-item__actions"><text @click="edit(item)">编辑</text><text @click="remove(item)">删除</text></view>
    </view></view>
    <view v-else class="empty-address"><uni-icons type="location" size="52" color="#c4c9c6" /><text>还没有收货地址</text></view>
    <button class="address-add pressable" @click="edit()">新增收货地址</button>
    <view v-if="editorVisible" class="address-mask" @click.self="editorVisible = false"><view class="address-editor">
      <text class="address-editor__title">{{ form.id ? '编辑地址' : '新增地址' }}</text>
      <input v-model="form.receiverName" placeholder="收货人姓名" /><input v-model="form.phone" type="number" maxlength="11" placeholder="手机号" /><input v-model="form.province" placeholder="省份" /><input v-model="form.city" placeholder="城市" /><input v-model="form.district" placeholder="区/县" /><input v-model="form.detail" placeholder="详细地址" />
      <view class="default-row"><text>设为默认地址</text><switch :checked="form.isDefault" @change="form.isDefault = $event.detail.value" /></view>
      <view class="editor-actions"><button @click="editorVisible = false">取消</button><button class="editor-actions__primary" :loading="saving" @click="save">保存</button></view>
    </view></view>
  </view>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import MallHeader from '../../components/MallHeader.vue'
import { deleteAddress, fetchAddresses, saveAddress } from '../../api/mall.js'
import { useAuthStore } from '../../stores/auth.js'

const auth = useAuthStore(); const addresses = ref([]); const error = ref(''); const editorVisible = ref(false); const saving = ref(false)
const emptyForm = () => ({ id: '', receiverName: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false })
const form = reactive(emptyForm())
onMounted(async () => { if (!auth.authenticated) await auth.login(); await load() })
async function load() { error.value = ''; try { addresses.value = (await fetchAddresses()).data } catch (reason) { error.value = reason.message || '地址加载失败' } }
function edit(item) { Object.assign(form, emptyForm(), item || { isDefault: addresses.value.length === 0 }); editorVisible.value = true }
async function save() { if (!form.receiverName || !/^1\d{10}$/.test(form.phone) || !form.detail) return uni.showToast({ title: '请完整填写地址信息', icon: 'none' }); saving.value = true; try { await saveAddress({ ...form }); editorVisible.value = false; await load(); uni.showToast({ title: '地址已保存', icon: 'success' }) } catch (reason) { uni.showToast({ title: reason.message || '保存失败', icon: 'none' }) } finally { saving.value = false } }
function remove(item) { uni.showModal({ title: '删除地址', content: '确认删除这条收货地址吗？', success: async ({ confirm }) => { if (!confirm) return; try { await deleteAddress(item.id); await load() } catch (reason) { uni.showToast({ title: reason.message || '删除失败', icon: 'none' }) } } }) }
</script>

<style scoped lang="scss">
.address-page { min-height: 100vh; padding-bottom: 140rpx; background: #f5f5f3; }.address-list { padding: 20rpx; }.address-item { margin-bottom: 16rpx; padding: 28rpx 24rpx; border-radius: 8rpx; background: #fff; }.address-item__head { display:flex; align-items:center; gap:22rpx; color:#303835; font-size:27rpx; }.address-item__tag { padding:4rpx 9rpx; border-radius:3rpx; background:#f9e3e0; color:#e43a35; font-size:19rpx; }.address-item__detail { display:block; margin-top:18rpx; color:#606864; font-size:24rpx; line-height:38rpx; }.address-item__actions { display:flex; justify-content:flex-end; gap:36rpx; margin-top:22rpx; padding-top:18rpx; border-top:1rpx solid #f0f0ee; color:#7c847f; font-size:23rpx; }.empty-address { display:flex; min-height:480rpx; flex-direction:column; align-items:center; justify-content:center; color:#9da4a1; font-size:24rpx; }.empty-address text { margin-top:18rpx; }.address-add { position:fixed; right:28rpx; bottom:calc(34rpx + env(safe-area-inset-bottom)); left:28rpx; height:84rpx; border-radius:42rpx; background:#e43a35; color:#fff; font-size:28rpx; line-height:84rpx; }.address-mask { position:fixed; z-index:150; inset:0; display:flex; align-items:flex-end; background:rgba(0,0,0,.52); }.address-editor { width:100%; padding:30rpx 26rpx calc(28rpx + env(safe-area-inset-bottom)); border-radius:20rpx 20rpx 0 0; background:#fff; }.address-editor__title { display:block; margin-bottom:18rpx; font-size:31rpx; font-weight:700; }.address-editor input { height:82rpx; border-bottom:1rpx solid #eceeec; font-size:25rpx; }.default-row { display:flex; min-height:84rpx; align-items:center; justify-content:space-between; color:#4c5752; font-size:24rpx; }.editor-actions { display:flex; gap:16rpx; margin-top:16rpx; }.editor-actions button { height:78rpx; flex:1; border:1rpx solid #d6dad7; border-radius:39rpx; background:#fff; color:#59635f; font-size:26rpx; line-height:76rpx; }.editor-actions__primary { border:0 !important; background:#e43a35 !important; color:#fff !important; }.error-state { display:flex; min-height:420rpx; flex-direction:column; align-items:center; justify-content:center; gap:20rpx; color:#a53b35; font-size:24rpx; }.error-state button { width:180rpx; height:66rpx; border-radius:33rpx; background:#e43a35; color:#fff; font-size:24rpx; line-height:66rpx; }
</style>
