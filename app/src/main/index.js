'use strict';

import { app, BrowserWindow, ipcMain} from 'electron';
import {autoUpdater} from 'electron-updater';
import log from 'electron-log';

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('starting');

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

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

function updateHeader(text) {
  log.info(text);
  mainWindow.webContents.send('updateHeader', text);
}

ipcMain.on('checkUpdates', (event, arg) => {
  event.returnValue = true;
  if (process.env.NODE_ENV !== 'development')
    autoUpdater.checkForUpdates();
});

ipcMain.on('performUpdate', (event) => {
  event.returnValue = true;
  autoUpdater.quitAndInstall();
});

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

ipcMain.on('loopBack', (event, arg) => {
  event.returnValue = true;
  updateHeader(arg);
});


autoUpdater.on('update-downloaded', (event, info) => {
  if (process.env.NODE_ENV != 'development') 
    mainWindow.webContents.send('updateReady');
});

autoUpdater.on('checking-for-update', () => {
  updateHeader('Checking for updates. . .');
});
autoUpdater.on('update-available', (ev, info) => {
  updateHeader('Found an update.');
});
autoUpdater.on('update-not-available', (ev, info) => {
  mainWindow.webContents.send('updateNotFound');
});

autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('Error in auto-updater.\n\n' + err + '\n' + err.message + '\n' + err.stack);
});

autoUpdater.on('download-progress', (progress) => {
  updateHeader(`Downloading: ${progress.percent}%`);
});


app.on('ready', function() {
  createWindow();
  setTimeout(function() {
    if (process.env.NODE_ENV !== 'development')
      autoUpdater.checkForUpdates();
  }, 5000);
});

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