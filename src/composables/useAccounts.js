import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const accounts = ref([])
const STORAGE_KEY = 'ai_accounts'
const hasDesktopAPI = typeof window !== 'undefined' && window.desktopAPI?.readAccounts

const readFromStorage = async () => {
    if (hasDesktopAPI) {
        try {
            return await window.desktopAPI.readAccounts()
        } catch (error) {
            console.error('Failed to read accounts from desktop storage', error)
            return []
        }
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

const serializeAccounts = (payload) => {
    try {
        return JSON.parse(JSON.stringify(payload ?? []))
    } catch {
        return []
    }
}

const writeToStorage = async (payload) => {
    const serializablePayload = serializeAccounts(payload)
    if (hasDesktopAPI) {
        try {
            await window.desktopAPI.writeAccounts(serializablePayload)
            return
        } catch (error) {
            console.error('Failed to write accounts to desktop storage', error)
        }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializablePayload))
}

export function useAccounts() {
    const loadAccounts = async () => {
        const stored = await readFromStorage()
        accounts.value = Array.isArray(stored) ? stored : []
        await checkExpiredAccounts()
    }

    const saveAccounts = async () => {
        await writeToStorage(accounts.value)
    }

    const checkExpiredAccounts = async () => {
        const now = new Date().toISOString().split('T')[0]
        let changed = false

        accounts.value.forEach(account => {
            if (account.expiryDate && account.expiryDate <= now) {
                account.type = 'Free'
                account.expiryDate = null
                changed = true
            }
        })

        if (changed) await saveAccounts()
    }

    const addAccount = async (account) => {
        accounts.value.push({
            id: uuidv4(),
            ...account,
            createdAt: new Date().toISOString()
        })
        await saveAccounts()
    }

    const updateAccount = async (id, updates) => {
        const index = accounts.value.findIndex(a => a.id === id)
        if (index !== -1) {
            accounts.value[index] = { ...accounts.value[index], ...updates }
            await saveAccounts()
        }
    }

    const deleteAccount = async (id) => {
        accounts.value = accounts.value.filter(a => a.id !== id)
        await saveAccounts()
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
