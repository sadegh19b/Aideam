<template>
  <div class="bg-white rounded-xl shadow-2xl p-6">
    <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
      <h2 class="text-3xl font-bold text-gray-800">{{ tool }}</h2>
      <span class="bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">{{ accounts.length }} اکانت</span>
    </div>
    
    <div v-if="accounts.length === 0" class="text-center py-12 text-gray-400 text-lg">
      هیچ اکانتی ثبت نشده است
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-right">
        <thead class="text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
          <tr>
            <th class="py-3 px-2 sm:px-4">ایمیل</th>
            <th class="py-3 px-2 sm:px-4">وضعیت</th>
            <th class="py-3 px-2 sm:px-4">تاریخ انقضا</th>
            <th class="py-3 px-2 sm:px-4"></th>
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
import AccountCard from './AccountCard.vue'

defineProps({
  tool: { type: String, required: true },
  accounts: { type: Array, required: true },
  activeId: { type: String, default: null },
})

defineEmits(['edit', 'delete'])
</script>
