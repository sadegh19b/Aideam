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
        height: 840,
        minWidth: 1024,
        minHeight: 640,
        backgroundColor: '#111827',
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

    const ensureFile = async () => {
        await fs.mkdir(dataDir, { recursive: true })
        try {
            await fs.access(accountsFile)
        } catch {
            await fs.writeFile(accountsFile, '[]', 'utf-8')
        }
    }

    ipcMain.handle('accounts:read', async () => {
        await ensureFile()
        const raw = await fs.readFile(accountsFile, 'utf-8')
        try {
            return JSON.parse(raw || '[]')
        } catch {
            return []
        }
    })

    ipcMain.handle('accounts:write', async (_event, payload) => {
        await ensureFile()
        const data = Array.isArray(payload) ? payload : []
        await fs.writeFile(accountsFile, JSON.stringify(data, null, 2), 'utf-8')
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
