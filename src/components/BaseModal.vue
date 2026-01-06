<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="show"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
        @click.self="handleBackdropClick"
      >
        <transition
          enter-active-class="transform transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-3 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transform transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-3 scale-95"
        >
          <div
            v-if="show"
            class="bg-white rounded-3xl shadow-2xl w-full p-6 sm:p-8 space-y-6 relative border border-gray-100 overflow-hidden"
            :class="[sizeClass, dialogClass]"
            role="dialog"
            aria-modal="true"
          >
            <button
              v-if="showCloseButton"
              class="absolute top-4 text-gray-400 hover:text-gray-600 text-3xl leading-none cursor-pointer"
              :class="{ 'left-4 right-auto': dir === 'rtl', 'right-4 left-auto': dir === 'ltr' }"
              @click="emit('close')"
              :aria-label="t('modal.close')"
            >
              ×
            </button>

            <header v-if="$slots.header" class="mb-2">
              <slot name="header" />
            </header>

            <div :dir="resolvedDir">
              <slot />
            </div>

            <footer v-if="$slots.footer" class="pt-4 border-t border-gray-100">
              <slot name="footer" />
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDirection } from '../composables/useDirection'

const props = defineProps({
  show: { type: Boolean, default: false },
  closeOnBackdrop: { type: Boolean, default: true },
  closeOnEscape: { type: Boolean, default: true },
  showCloseButton: { type: Boolean, default: true },
  dialogClass: { type: [String, Array, Object], default: '' },
  dir: { type: String, default: null },
  size: {
    type: String,
    default: 'lg',
    validator: value => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  }
})

const emit = defineEmits(['close'])
const { t } = useI18n()
const { dir: globalDir } = useDirection()

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90rem]'
}

const sizeClass = computed(() => sizeMap[props.size] || sizeMap.lg)
const resolvedDir = computed(() => props.dir || globalDir.value)

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}

const handleEscapeClose = () => {
  if (props.closeOnEscape) {
    emit('close')
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    handleEscapeClose()
  }
}

const stopWatching = watch(
  () => props.show,
  (visible) => {
    if (visible) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  stopWatching()
})
</script>
