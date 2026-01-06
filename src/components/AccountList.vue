<template>
  <div class="bg-white rounded-xl shadow-2xl p-6">
    <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
      <h2 class="text-3xl font-bold text-gray-800">{{ tool }}</h2>
      <span class="bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
        {{ t('list.accountCount', { count: accounts.length }) }}
      </span>
    </div>
    
    <div v-if="accounts.length === 0" class="text-center py-12 text-gray-400 text-lg">
      {{ t('list.empty') }}
    </div>
    
    <div v-else class="overflow-x-auto">
      <table
        class="min-w-full"
        :class="textAlignClass"
        :dir="dir"
      >
        <thead class="text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
          <tr>
            <th class="py-3 px-2 sm:px-4">{{ t('list.columns.email') }}</th>
            <th class="py-3 px-2 sm:px-4">{{ t('list.columns.status') }}</th>
            <th class="py-3 px-2 sm:px-4">{{ t('list.columns.expiry') }}</th>
            <th class="py-3 px-2 sm:px-4">{{ t('list.columns.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <AccountCard
            v-for="account in accounts"
            :key="account.id"
            :account="account"
            :is-active="activeId === account.id"
            @edit="$emit('edit', account)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useDirection } from '../composables/useDirection'
import AccountCard from './AccountCard.vue'

defineProps({
  tool: { type: String, required: true },
  accounts: { type: Array, required: true },
  activeId: { type: String, default: null },
})

defineEmits(['edit', 'delete'])

const { t } = useI18n()
const { dir, textAlignClass } = useDirection()
</script>
