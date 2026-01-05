import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('desktopApp', {
    platform: process.platform,
    isDev: !!process.env.VITE_DEV_SERVER_URL
})
