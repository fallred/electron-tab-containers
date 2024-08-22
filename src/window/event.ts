import { BrowserWindow, app, globalShortcut } from 'electron';

export function addEvent() {
    app.on('ready', () => {
        const win = new BrowserWindow()

        globalShortcut.register('CommandOrControl+Shift', () => {
            win.webContents.openDevTools()
        })
    })

    app.on('will-quit', () => {
        // 注销快捷键
        globalShortcut.unregister('CommandOrControl+Shift')

        // 注销所有快捷键
        globalShortcut.unregisterAll()
    })
}