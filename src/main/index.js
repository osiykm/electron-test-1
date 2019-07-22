import { app, BrowserWindow, ipcMain } from 'electron'; // eslint-disable-line
import path from 'path';

const { spawn } = require('child_process');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  // eslint-disable-next-line no-underscore-dangle
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\'); // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

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

ipcMain.on('test', (event, arg) => {
  console.log(arg);
  console.log(path.join(`${__dirname}/../../../openvpn/openvpn.exe`));
  // event.sender.send('testReply', path.join(__dirname, '../../openvpn/openvpn.exe'));
  console.log(arg);
  const command = path.join('../../../openvpn/openvpn.exe');
  const VPN = spawn(command, ['--config', path.join('../../../openvpn/zaborona.ovpn')]);
  VPN.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(text);
    event.sender.send('testReply', text);
  });
  VPN.stderr.on('data', (data) => {
    const text = data.toString();
    console.log(text);
    event.sender.send('testReply', text);
  });
});


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
