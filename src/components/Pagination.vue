<template>
  <div v-if="totalPages > 1" class="mt-6 flex flex-col items-center gap-4">
    <div class="flex justify-center items-center gap-2">
      <button
        @click="$emit('page-change', 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {{ t('pagination.first') }}
      </button>
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {{ t('pagination.previous') }}
      </button>
      
      <span class="flex gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('page-change', page)"
          :class="[
            'px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer',
            currentPage === page
              ? 'bg-indigo-500 text-white border-indigo-500'
              : 'hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
      </span>
      
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {{ t('pagination.next') }}
      </button>
      <button
        @click="$emit('page-change', totalPages)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {{ t('pagination.last') }}
      </button>
    </div>
    
    <div class="text-center text-sm text-gray-600">
      {{ t('pagination.showing', { 
        start: (currentPage - 1) * itemsPerPage + 1,
        end: Math.min(currentPage * itemsPerPage, totalItems),
        total: totalItems
      }) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true }
})

defineEmits(['page-change'])

const { t } = useI18n()

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const delta = 2
  
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots.filter(page => page !== '...')
})
</script>
