<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 flex items-center justify-center transition-[direction]"
    :dir="dir"
  >
    <div class="w-full max-w-7xl mx-auto space-y-6">
      <div class="flex flex-wrap items-center gap-3"
          :class="dir === 'rtl' ? 'justify-end' : 'justify-start'"
      >
        <label class="text-white/90 text-sm font-semibold" :for="languageSelectId">
          {{ t('app.languageLabel') }}
        </label>
        <select
          :id="languageSelectId"
          v-model="locale"
          class="px-4 py-2 rounded-full bg-white/90 text-gray-800 text-sm font-semibold shadow focus:outline-none cursor-pointer"
          dir="ltr"
        >
          <option value="fa">{{ t('app.languages.fa') }}</option>
          <option value="en">{{ t('app.languages.en') }}</option>
        </select>
      </div>

      <main class="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        <AccountForm
          :editAccount="editingAccount"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
        
        <div class="flex flex-col gap-8">
          <AccountList
            :tool="t('tools.cursor')"
            :accounts="cursorAccounts"
            :active-id="activeAccountId"
            @edit="handleEdit"
            @delete="handleDelete"
          />
          
          <AccountList
            :tool="t('tools.windsurf')"
            :accounts="windsurfAccounts"
            :active-id="activeAccountId"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'
import AccountForm from './components/AccountForm.vue'
import AccountList from './components/AccountList.vue'
import { useAccounts } from './composables/useAccounts'
import { useSettings } from './composables/useSettings'
import { useDirection } from './composables/useDirection'

const { t, locale } = useI18n()
const languageSelectId = 'app-language-select'

const { accounts, loadAccounts, addAccount, updateAccount, deleteAccount, checkExpiredAccounts } = useAccounts()
const { loadSettings, setLanguage } = useSettings()
const { dir } = useDirection()

const editingAccount = ref(null)
const activeAccountId = ref(null)

const cursorAccounts = computed(() => accounts.value.filter(a => a.tool === 'Cursor'))
const windsurfAccounts = computed(() => accounts.value.filter(a => a.tool === 'Windsurf'))

const updateDocumentLanguage = (lang) => {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr')
}

const initializeSettings = async () => {
  const stored = await loadSettings()
  if (stored?.language) {
    locale.value = stored.language
  }
  updateDocumentLanguage(locale.value)
}

watch(locale, async (newLocale, oldLocale) => {
  if (!newLocale || newLocale === oldLocale) return
  await setLanguage(newLocale)
  updateDocumentLanguage(newLocale)
})

const handleSubmit = async (accountData) => {
  if (editingAccount.value) {
    await updateAccount(editingAccount.value.id, accountData)
    editingAccount.value = null
    activeAccountId.value = null
    Swal.fire({
      icon: 'success',
      title: t('swal.update.title'),
      text: t('swal.update.text'),
      confirmButtonText: t('swal.shared.ok')
    })
  } else {
    await addAccount(accountData)
    Swal.fire({
      icon: 'success',
      title: t('swal.create.title'),
      text: t('swal.create.text'),
      confirmButtonText: t('swal.shared.ok')
    })
  }
}

const handleEdit = (account) => {
  editingAccount.value = account
  activeAccountId.value = account.id
}

const handleCancel = () => {
  editingAccount.value = null
  activeAccountId.value = null
}

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: t('swal.delete.title'),
    text: t('swal.delete.text'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('swal.delete.confirm'),
    cancelButtonText: t('swal.delete.cancel'),
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    focusCancel: true
  })

  if (result.isConfirmed) {
    await deleteAccount(id)
    Swal.fire({
      icon: 'success',
      title: t('swal.delete.successTitle'),
      text: t('swal.delete.successText'),
      confirmButtonText: t('swal.shared.ok')
    })
  }
}

let expiryCheckInterval

onMounted(async () => {
  await Promise.all([loadAccounts(), initializeSettings()])
  expiryCheckInterval = setInterval(checkExpiredAccounts, 60000)
})

onUnmounted(() => {
  if (expiryCheckInterval) {
    clearInterval(expiryCheckInterval)
  }
})
</script>
