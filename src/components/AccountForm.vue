<template>
  <div class="bg-white rounded-xl shadow-2xl p-6 lg:sticky lg:top-5">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ editMode ? 'ویرایش اکانت' : 'افزودن اکانت جدید' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">ابزار:</label>
        <select v-model="form.tool" dir="ltr" required class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition">
          <option value="Cursor">Cursor</option>
          <option value="Windsurf">Windsurf</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">نوع:</label>
        <select v-model="form.type" dir="ltr" required class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition">
          <option value="Free">Free</option>
          <option value="Trial">Trial</option>
          <option value="Limited">Limited</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">ایمیل:</label>
        <input v-model="form.email" dir="ltr" type="email" required class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition">
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">رمز عبور:</label>
        <input v-model="form.password" dir="ltr" type="text" required class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition">
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">توضیحات:</label>
        <textarea v-model="form.description" dir="ltr" rows="2" class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition resize-none"></textarea>
      </div>
      
      <div v-if="form.type !== 'Free'">
        <label class="block text-sm font-semibold text-gray-700 mb-2">تاریخ انقضا:</label>
        <input v-model="form.expiryDate" dir="ltr" type="date" class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition">
      </div>
      
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all">
          {{ editMode ? 'بروزرسانی' : 'افزودن' }}
        </button>
        <button v-if="editMode" type="button" @click="handleCancel" class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
          لغو
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  editAccount: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  tool: 'Cursor',
  type: 'Free',
  email: '',
  password: '',
  description: '',
  expiryDate: null
})

const editMode = computed(() => props.editAccount !== null)

watch(() => props.editAccount, (account) => {
  if (account) {
    Object.assign(form, account)
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => form.type, (newType) => {
  if (newType === 'Free') {
    form.expiryDate = null
  }
})

const handleSubmit = () => {
  emit('submit', { ...form })
  if (!editMode.value) resetForm()
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

function resetForm() {
  form.tool = 'Cursor'
  form.type = 'Free'
  form.email = ''
  form.password = ''
  form.description = ''
  form.expiryDate = null
}
</script>
