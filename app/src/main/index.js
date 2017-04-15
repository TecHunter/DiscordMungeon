'use strict';

import { app, BrowserWindow, ipcMain, autoUpdater } from 'electron';

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // eslint-disable-next-line no-console
  console.log('mainWindow opened');
}

ipcMain.on('isMaximized', (event, arg) => {
  event.returnValue = mainWindow.isMaximized();
});

ipcMain.on('toggleMaximize', (event, arg) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
  event.returnValue = mainWindow.isMaximized();
});

ipcMain.on('minimize', (event, arg) => {
  mainWindow.minimize();
  event.returnValue = mainWindow.isMinimized();
});

ipcMain.on('close', (event, arg) => {
  event.returnValue = true;
  mainWindow.close();
  app.quit();
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
  autoUpdater.quitAndInstall();
});

if (process.env.NODE_ENV != 'development') {
  autoUpdater.setFeedURL('https://discordmungeon.herokuapp.com/feed/channel/all.atom');
  autoUpdater.checkForUpdates();
}