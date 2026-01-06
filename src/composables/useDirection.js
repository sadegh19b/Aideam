import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const RTL_LOCALES = ['fa']

export function useDirection() {
    const { locale } = useI18n({ useScope: 'global' })

    const isRtl = computed(() => RTL_LOCALES.includes(locale.value))
    const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
    const textAlignClass = computed(() => (isRtl.value ? 'text-right' : 'text-left'))

    return {
        isRtl,
        dir,
        textAlignClass
    }
}
