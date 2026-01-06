import { ref } from 'vue'

const DEFAULT_SETTINGS = Object.freeze({
    language: 'en'
})

const settings = ref({ ...DEFAULT_SETTINGS })
const STORAGE_KEY = 'ai_settings'

const hasDesktopSettingsAPI = typeof window !== 'undefined' && window.desktopAPI?.readSettings

const serializeSettings = (payload) => {
    try {
        return JSON.parse(JSON.stringify(payload ?? {}))
    } catch {
        return { ...DEFAULT_SETTINGS }
    }
}

const readFromStorage = async () => {
    if (hasDesktopSettingsAPI) {
        try {
            const stored = await window.desktopAPI.readSettings()
            return stored && typeof stored === 'object' ? stored : {}
        } catch (error) {
            console.error('Failed to read settings from desktop storage', error)
            return {}
        }
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}

    try {
        const parsed = JSON.parse(stored)
        return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
        return {}
    }
}

const writeToStorage = async (payload) => {
    const serializablePayload = serializeSettings(payload)

    if (hasDesktopSettingsAPI) {
        try {
            await window.desktopAPI.writeSettings(serializablePayload)
            return
        } catch (error) {
            console.error('Failed to write settings to desktop storage', error)
        }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializablePayload))
}

export function useSettings() {
    const loadSettings = async () => {
        const stored = await readFromStorage()
        settings.value = { ...DEFAULT_SETTINGS, ...stored }
        return settings.value
    }

    const updateSettings = async (updates) => {
        settings.value = { ...settings.value, ...updates }
        await writeToStorage(settings.value)
        return settings.value
    }

    const setLanguage = async (language) => {
        const normalized = typeof language === 'string' ? language : DEFAULT_SETTINGS.language
        await updateSettings({ language: normalized })
    }

    return {
        settings,
        loadSettings,
        updateSettings,
        setLanguage
    }
}
