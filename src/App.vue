<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 flex items-center justify-center">
    <div class="w-full max-w-7xl mx-auto">
      <main class="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        <AccountForm
          :editAccount="editingAccount"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
        
        <div class="flex flex-col gap-8">
          <AccountList
            tool="Cursor"
            :accounts="cursorAccounts"
            :active-id="activeAccountId"
            @edit="handleEdit"
            @delete="handleDelete"
          />
          
          <AccountList
            tool="Windsurf"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import AccountForm from './components/AccountForm.vue'
import AccountList from './components/AccountList.vue'
import { useAccounts } from './composables/useAccounts'

const { accounts, loadAccounts, addAccount, updateAccount, deleteAccount, checkExpiredAccounts } = useAccounts()

const editingAccount = ref(null)
const activeAccountId = ref(null)

const cursorAccounts = computed(() => accounts.value.filter(a => a.tool === 'Cursor'))
const windsurfAccounts = computed(() => accounts.value.filter(a => a.tool === 'Windsurf'))

const handleSubmit = (accountData) => {
  if (editingAccount.value) {
    updateAccount(editingAccount.value.id, accountData)
    editingAccount.value = null
    activeAccountId.value = null
    Swal.fire({
      icon: 'success',
      title: 'ویرایش انجام شد',
      text: 'اطلاعات اکانت با موفقیت بروزرسانی شد',
      confirmButtonText: 'باشه'
    })
  } else {
    addAccount(accountData)
    Swal.fire({
      icon: 'success',
      title: 'ثبت شد',
      text: 'اکانت جدید با موفقیت اضافه شد',
      confirmButtonText: 'باشه'
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
    title: 'حذف اکانت',
    text: 'آیا از حذف این اکانت اطمینان دارید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف شود',
    cancelButtonText: 'انصراف',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    focusCancel: true
  })

  if (result.isConfirmed) {
    deleteAccount(id)
    Swal.fire({
      icon: 'success',
      title: 'حذف شد',
      text: 'اکانت با موفقیت حذف شد',
      confirmButtonText: 'باشه'
    })
  }
}

let expiryCheckInterval

onMounted(() => {
  loadAccounts()
  expiryCheckInterval = setInterval(checkExpiredAccounts, 60000)
})

onUnmounted(() => {
  if (expiryCheckInterval) {
    clearInterval(expiryCheckInterval)
  }
})
</script>
