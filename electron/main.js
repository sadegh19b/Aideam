import { app, BrowserWindow, shell, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = !!process.env.VITE_DEV_SERVER_URL
const distPath = path.resolve(__dirname, '../dist')
const indexHtml = path.join(distPath, 'index.html')

let mainWindow = null

async function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 950,
        minWidth: 1024,
        minHeight: 768,
        backgroundColor: '#111827',
        resizable: true,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    })

    mainWindow.once('ready-to-show', () => mainWindow?.show())

    if (isDev) {
        await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
        mainWindow.webContents.openDevTools({ mode: 'detach' })
    } else {
        await mainWindow.loadFile(indexHtml)
    }

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })
}

function registerFileHandlers() {
    const resolveDataDir = () => {
        if (isDev) return path.join(process.cwd(), 'release/data')

        const exeDir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(app.getPath('exe'))
        return path.join(exeDir, 'data')
    }

    const dataDir = resolveDataDir()
    const accountsFile = path.join(dataDir, 'accounts.json')
    const settingsFile = path.join(dataDir, 'settings.json')

    const ensureFile = async (filePath, defaultContent) => {
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        try {
            await fs.access(filePath)
        } catch {
            await fs.writeFile(filePath, defaultContent, 'utf-8')
        }
    }

    ipcMain.handle('accounts:read', async () => {
        await ensureFile(accountsFile, '[]')
        const raw = await fs.readFile(accountsFile, 'utf-8')
        try {
            const parsed = JSON.parse(raw || '[]')
            if (!Array.isArray(parsed)) {
                console.error('Accounts file contains invalid data structure')
                return []
            }
            return parsed
        } catch (err) {
            console.error('Failed to parse accounts file:', err)
            return []
        }
    })

    ipcMain.handle('accounts:write', async (_event, payload) => {
        await ensureFile(accountsFile, '[]')
        
        if (!Array.isArray(payload)) {
            throw new Error('Invalid payload: expected array')
        }
        
        const validAccounts = payload.filter(acc => {
            return acc && 
                   typeof acc === 'object' && 
                   typeof acc.id === 'string' &&
                   typeof acc.email === 'string' &&
                   typeof acc.tool === 'string'
        })
        
        await fs.writeFile(accountsFile, JSON.stringify(validAccounts, null, 2), 'utf-8')
        return true
    })

    ipcMain.handle('settings:read', async () => {
        await ensureFile(settingsFile, JSON.stringify({ language: 'en' }, null, 2))
        const raw = await fs.readFile(settingsFile, 'utf-8')
        try {
            return JSON.parse(raw || '{}')
        } catch {
            return { language: 'en' }
        }
    })

    ipcMain.handle('settings:write', async (_event, payload) => {
        await ensureFile(settingsFile, JSON.stringify({ language: 'en' }, null, 2))
        const data = payload && typeof payload === 'object' ? payload : { language: 'en' }
        await fs.writeFile(settingsFile, JSON.stringify(data, null, 2), 'utf-8')
        return true
    })
}

app.whenReady().then(async () => {
    registerFileHandlers()
    await createMainWindow()

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createMainWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
