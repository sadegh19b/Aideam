<template>
  <div class="bg-white rounded-xl shadow-2xl p-6">
    <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
      <h2 class="text-3xl font-bold text-gray-800">{{ t('app.title') }}</h2>
      <span class="bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
        {{ t('list.accountCount', { count: filteredAccounts.length }) }}
      </span>
    </div>
    
    <!-- Filters -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('filters.tool') }}:</label>
          <select v-model="filters.tool" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">{{ t('filters.all') }}</option>
            <option value="Cursor">Cursor</option>
            <option value="Windsurf">Windsurf</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('filters.status') }}:</label>
          <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">{{ t('filters.all') }}</option>
            <option value="Free">{{ t('form.types.free') }}</option>
            <option value="Trial">{{ t('form.types.trial') }}</option>
            <option value="Limited">{{ t('form.types.limited') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('filters.used') }}:</label>
          <select v-model="filters.used" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">{{ t('filters.all') }}</option>
            <option value="true">{{ t('form.used.yes') }}</option>
            <option value="false">{{ t('form.used.no') }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">
          {{ t('filters.reset') }}
        </button>
      </div>
    </div>
    
    <div v-if="filteredAccounts.length === 0" class="text-center py-12 text-gray-400 text-lg">
      {{ accounts.length === 0 ? t('list.empty') : t('filters.noResults') }}
    </div>
    
    <div v-else>
      <div class="overflow-x-auto">
        <table
          class="min-w-full"
          :class="textAlignClass"
          :dir="dir"
        >
          <thead class="text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th class="py-3 px-2 sm:px-4">{{ t('list.columns.tool') }}</th>
              <th class="py-3 px-2 sm:px-4">{{ t('list.columns.email') }}</th>
              <th class="py-3 px-2 sm:px-4">{{ t('list.columns.status') }}</th>
              <th class="py-3 px-2 sm:px-4">{{ t('list.columns.provider') }}</th>
              <th class="py-3 px-2 sm:px-4">{{ t('list.columns.used') }}</th>
              <th class="py-3 px-2 sm:px-4">{{ t('list.columns.expiry') }}</th>
              <th class="py-3 px-2 sm:px-4">{{ t('list.columns.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <AccountCard
              v-for="account in paginatedAccounts"
              :key="account.id"
              :account="account"
              :is-active="activeId === account.id"
              @edit="$emit('edit', account)"
              @delete="$emit('delete', $event)"
            />
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="filteredAccounts.length"
        :items-per-page="itemsPerPage"
        @page-change="currentPage = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDirection } from '../composables/useDirection'
import AccountCard from './AccountCard.vue'
import Pagination from './Pagination.vue'

const props = defineProps({
  accounts: { type: Array, required: true },
  activeId: { type: String, default: null },
  itemsPerPage: { type: Number, default: 10 }
})

defineEmits(['edit', 'delete'])

const { t } = useI18n()
const { dir, textAlignClass } = useDirection()

const filters = ref({
  tool: '',
  type: '',
  used: ''
})

const currentPage = ref(1)

const filteredAccounts = computed(() => {
  return props.accounts.filter(account => {
    const toolMatch = !filters.value.tool || account.tool === filters.value.tool
    const typeMatch = !filters.value.type || account.type === filters.value.type
    
    let usedMatch = true
    if (filters.value.used !== '') {
      const filterUsed = filters.value.used === 'true'
      // Handle undefined used field - treat undefined as false
      const accountUsed = account.used === true
      usedMatch = accountUsed === filterUsed
    }
    
    return toolMatch && typeMatch && usedMatch
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredAccounts.value.length / props.itemsPerPage)
})

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredAccounts.value.slice(start, end)
})

const resetFilters = () => {
  filters.value = {
    tool: '',
    type: '',
    used: ''
  }
  currentPage.value = 1
}

// Reset page when filters or itemsPerPage change
watch(() => [filters.value.tool, filters.value.type, filters.value.used, props.itemsPerPage], () => {
  currentPage.value = 1
})
</script>
