import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('desktopAPI', {
    platform: process.platform,
    isDev: !!process.env.VITE_DEV_SERVER_URL,
    readAccounts: () => ipcRenderer.invoke('accounts:read'),
    writeAccounts: (accounts) => ipcRenderer.invoke('accounts:write', accounts)
})
