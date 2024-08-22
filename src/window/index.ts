import { BrowserWindow, app, globalShortcut } from 'electron';
import { getPreloadPath, getSendEventJS, handleOpenWindow, startDevToolsIfNeed } from '../helpers/web'
import { GNBEventBus } from '../helpers/event-bus'
import { eventKey } from '../const'
import {addEvent} from './event';

export let mainWindow: BrowserWindow

export function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
    },
  })

  win.loadURL('http://localhost:9080');

  // 打开开发者工具
  win.webContents.on('did-finish-load', () => {
    win.webContents.openDevTools({ mode: 'detach' });
  });
 
  app.on('ready', () => {
      globalShortcut.register('CommandOrControl+Shift', () => {
        win?.webContents.openDevTools()
      })
  })

  app.on('will-quit', () => {
      // 注销快捷键
      globalShortcut.unregister('CommandOrControl+Shift')

      // 注销所有快捷键
      globalShortcut.unregisterAll()
  })

  const handler = (data: any) => {
    win.webContents?.executeJavaScript(getSendEventJS(eventKey, data))
  }
  GNBEventBus.shared.subscribe(handler)

  handleOpenWindow(win.webContents)

  startDevToolsIfNeed(win.webContents)

  mainWindow = win

}

