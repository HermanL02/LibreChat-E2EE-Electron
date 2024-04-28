/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import express, { Request, Response } from 'express';
import { Server } from 'http';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import KeyStore from './components/keystore';
import Encryptor from './components/encryptor';
import HookDirect from './components/hookdirect';
// set global variables
const globalAny: any = global;
globalAny.sharedPort = 3000;
globalAny.hooked = false;
const newExpressServer = express();
newExpressServer.use(express.json());
const server: Server = newExpressServer.listen(globalAny.sharedPort, () => {
  console.log(`Server listening at http://localhost:${globalAny.sharedPort}`);
});
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${globalAny.sharedPort} is already in use.`);
    // 尝试另一个端口
    server.close();
    globalAny.sharedPort += 1;
    server.listen(globalAny.sharedPort);
  } else {
    console.error(error);
  }
});
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
// IPC handlers
ipcMain.on('request-shared-port', (event) => {
  console.log(globalAny.sharedPort);
  event.reply('response-shared-port', globalAny.sharedPort);
});

ipcMain.handle('get-all-friends', async () => {
  return KeyStore.getAllFriends();
});
ipcMain.handle('insert-friend', async (event, name, publicKey) => {
  return KeyStore.insertFriend(name, publicKey);
});
ipcMain.handle('update-personal-keys', async () => {
  return KeyStore.updatePersonalKeys();
});
ipcMain.handle('get-personal-keys', async () => {
  return KeyStore.getPersonalKeys();
});
ipcMain.handle('encrypt', async (event, text, publicKey) => {
  return Encryptor.encrypt(text, publicKey);
});
ipcMain.handle('decrypt', async (event, text, privateKey) => {
  return Encryptor.decrypt(text, privateKey);
});
ipcMain.handle('check-wechat-login', async () => {
  const returndata = await HookDirect.checkLogin();
  return returndata;
});
ipcMain.handle('hook-wechat', async (event, hookSettings) => {
  return HookDirect.hookMessage(hookSettings);
});
ipcMain.handle('send-msg-hook', async (event, sendMsgHookSettings) => {
  console.log(sendMsgHookSettings);
  return HookDirect.sendMsg(sendMsgHookSettings);
});
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  ipcMain.on('show-dialog', (event, arg) => {
    if (mainWindow) {
      const { title, message, type, buttons } = arg;
      dialog
        .showMessageBox(mainWindow, {
          type,
          title,
          message,
          buttons,
        })
        .then((result) => {
          event.reply('dialog-response', result.response);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Unable to show dialog，mainWindow == null。');
    }
  });
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
newExpressServer.post('/', (req: Request, res: Response) => {
  console.log(globalAny.hooked);
  console.log(req.body);
  if (mainWindow) {
    mainWindow.webContents.send('displayMessage', req.body);
  }
  res.status(200).send('Message received');
});
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
