<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 flex items-center justify-center transition-[direction]"
    :dir="dir"
  >
    <div class="w-full max-w-7xl mx-auto space-y-6">
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center gap-3"
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
          
          <div class="flex items-center gap-2">
            <label class="text-white/90 text-sm font-semibold" :for="itemsPerPageSelect">
              {{ t('app.itemsPerPage') }}:
            </label>
            <select
              :id="itemsPerPageSelect"
              v-model="itemsPerPage"
              class="px-3 py-2 rounded-full bg-white/90 text-gray-800 text-sm font-semibold shadow focus:outline-none cursor-pointer"
              dir="ltr"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <button @click="showFormModal = true" class="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer">
          {{ t('form.titles.create') }}
        </button>
      </div>

      <main class="flex flex-col gap-6">
        <AccountList
          :accounts="accounts"
          :active-id="activeAccountId"
          :items-per-page="itemsPerPage"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </main>

      <AccountFormModal
        :show="showFormModal"
        :editAccount="editingAccount"
        @submit="handleSubmit"
        @close="handleCloseForm"
      />
      
      <!-- Footer -->
      <footer class="mt-8 text-center text-white/40 text-xs">
        <p>Aideam v{{ appVersion }} - AI IDE Account Manager</p>
        <p class="mt-1">Made by vibe coding (By <a href="https://github.com/sadegh19b" target="_blank" class="text-white/50 hover:text-white/70 underline transition-colors">Sadegh19B</a>)</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'
import AccountList from './components/AccountList.vue'
import AccountFormModal from './components/AccountFormModal.vue'
import { useAccounts } from './composables/useAccounts'
import { useSettings } from './composables/useSettings'
import { useDirection } from './composables/useDirection'

const { t, locale } = useI18n()
const languageSelectId = 'app-language-select'
const itemsPerPageSelect = 'items-per-page-select'

// Get app version from package.json
const appVersion = ref('2.5.0')

const { accounts, loadAccounts, addAccount, updateAccount, deleteAccount, checkExpiredAccounts } = useAccounts()
const { loadSettings, setLanguage } = useSettings()
const { dir } = useDirection()

const editingAccount = ref(null)
const activeAccountId = ref(null)
const showFormModal = ref(false)
const itemsPerPage = ref(10)

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
    showFormModal.value = false
    Swal.fire({
      icon: 'success',
      title: t('swal.update.title'),
      text: t('swal.update.text'),
      confirmButtonText: t('swal.shared.ok')
    })
  } else {
    await addAccount(accountData)
    showFormModal.value = false
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
  showFormModal.value = true
}

const handleCancel = () => {
  editingAccount.value = null
  activeAccountId.value = null
}

const handleCloseForm = () => {
  editingAccount.value = null
  activeAccountId.value = null
  showFormModal.value = false
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
