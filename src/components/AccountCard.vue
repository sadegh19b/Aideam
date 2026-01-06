<template>
  <tr
    class="border-b border-gray-100 last:border-0 transition-colors"
    :class="{
      'bg-blue-100 hover:bg-blue-200': rowIsActive,
      'hover:bg-indigo-50/40': !rowIsActive
    }"
  >
    <td class="py-4 px-2 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
      <div class="flex items-center gap-3">
        <span class="font-medium">{{ account.email }}</span>
      </div>
    </td>
    <td class="py-4 px-2 sm:px-4 text-xs font-bold">
      <span class="px-3 py-1 rounded-full uppercase"
            :class="{
              'bg-green-100 text-green-700': account.type === 'Free',
              'bg-yellow-100 text-yellow-700': account.type === 'Trial',
              'bg-red-100 text-red-700': account.type === 'Limited'
            }">
        {{ account.type }}
      </span>
    </td>
    <td class="py-4 px-2 sm:px-4 text-sm text-gray-700 whitespace-nowrap">
      <span v-if="account.expiryDate" dir="ltr">{{ account.expiryDate }}</span>
      <span v-else class="text-gray-400">—</span>
    </td>
    <td class="py-4 px-2 sm:px-4 text-sm">
      <div class="flex flex-wrap gap-2 justify-end">
        <button @click.stop="showDetails = true"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition cursor-pointer">
          مشاهده
        </button>
        <button @click="$emit('edit', account)" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer">
          ویرایش
        </button>
        <button @click="$emit('delete', account.id)" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition cursor-pointer">
          حذف
        </button>
      </div>
    </td>

    <AccountDetailsModal
      :show="showDetails"
      :account="account"
      @close="showDetails = false"
    />
  </tr>
</template>

<script setup>
import { ref, computed } from 'vue'
import AccountDetailsModal from './AccountDetailsModal.vue'

const props = defineProps({
  account: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

const showDetails = ref(false)
const rowIsActive = computed(() => props.isActive || showDetails.value)
</script>
