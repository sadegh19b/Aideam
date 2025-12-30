import { ref, computed } from 'vue'

const accounts = ref([])
const STORAGE_KEY = 'ai_accounts'

export function useAccounts() {
    const loadAccounts = () => {
        const stored = localStorage.getItem(STORAGE_KEY)
        accounts.value = stored ? JSON.parse(stored) : []
        checkExpiredAccounts()
    }

    const saveAccounts = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
    }

    const checkExpiredAccounts = () => {
        const now = new Date().toISOString().split('T')[0]
        let changed = false

        accounts.value.forEach(account => {
            if (account.expiryDate && account.expiryDate <= now) {
                account.type = 'Free'
                account.expiryDate = null
                changed = true
            }
        })

        if (changed) saveAccounts()
    }

    const addAccount = (account) => {
        const newId = accounts.value.length > 0 ? Math.max(...accounts.value.map(a => a.id)) + 1 : 1;
        accounts.value.push({
            id: newId,
            ...account,
            createdAt: new Date().toISOString()
        })
        saveAccounts()
    }

    const updateAccount = (id, updates) => {
        const index = accounts.value.findIndex(a => a.id === id)
        if (index !== -1) {
            accounts.value[index] = { ...accounts.value[index], ...updates }
            saveAccounts()
        }
    }

    const deleteAccount = (id) => {
        accounts.value = accounts.value.filter(a => a.id !== id)
        saveAccounts()
    }

    const getAccountsByTool = (tool) => {
        return computed(() => accounts.value.filter(a => a.tool === tool))
    }

    return {
        accounts,
        loadAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
        getAccountsByTool,
        checkExpiredAccounts
    }
}
