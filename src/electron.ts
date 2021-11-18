import { app, BrowserWindow } from 'electron';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const remote = require('@electron/remote/main');

remote.initialize();

const createWindow = () => {
  const win = new BrowserWindow({
    height: 720,
    width: 1080,
    frame: false,
    webPreferences: {
      webSecurity: false,
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.loadURL('http://localhost:1234');

  win.webContents.openDevTools();
  remote.enable(win.webContents);
};

app.commandLine.appendSwitch('disable-http-cache');

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
