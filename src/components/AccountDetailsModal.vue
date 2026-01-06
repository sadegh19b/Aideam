<template>
  <BaseModal :show="show" size="md" :dir="dir" @close="emit('close')">
    <template #header>
      <div class="flex flex-wrap items-center gap-4">
        <h3 class="text-2xl font-bold text-gray-900">{{ account.tool }}</h3>
        <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase"
              :class="badgeClasses">
          {{ typeLabel }}
        </span>
        <span v-if="account.expiryDate" class="text-sm text-gray-500">
          {{ t('details.expiry') }}:
          <span dir="ltr">{{ account.expiryDate }}</span>
        </span>
      </div>
    </template>

    <div class="space-y-4 text-sm leading-relaxed">
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <label class="font-semibold text-gray-600 min-w-[80px]">{{ t('details.email') }}:</label>
        <span class="text-gray-900 break-all">{{ account.email }}</span>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <label class="font-semibold text-gray-600 min-w-[80px]">{{ t('details.password') }}:</label>
        <span class="text-gray-900 break-all font-mono tracking-wide">{{ account.password }}</span>
      </div>
      <div v-if="account.description" class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <label class="font-semibold text-gray-600 min-w-[80px]">{{ t('details.description') }}:</label>
        <p dir="ltr" class="text-gray-900 break-all whitespace-pre-line">{{ account.description }}</p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDirection } from '../composables/useDirection'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  account: { type: Object, required: true }
})

const emit = defineEmits(['close'])
const { t } = useI18n()
const { dir } = useDirection()

const badgeClasses = computed(() => ({
  'bg-green-500 text-white': props.account.type === 'Free',
  'bg-yellow-400 text-gray-800': props.account.type === 'Trial',
  'bg-red-500 text-white': props.account.type === 'Limited'
}))

const typeLabel = computed(() => {
  switch (props.account.type) {
    case 'Trial':
      return t('form.types.trial')
    case 'Limited':
      return t('form.types.limited')
    default:
      return t('form.types.free')
  }
})
</script>
