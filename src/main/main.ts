/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Server } from 'net'; // Import the 'net' module
import JSONBig from 'json-bigint';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import KeyStore from './components/keystore';
import Encryptor from './components/encryptor';
import HookDirect from './components/hookdirect';
// set global variables
const globalAny: any = global;
globalAny.sharedPort = 3000;
globalAny.hooked = false;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
// Create a TCP server
const server = new Server((socket) => {
  socket.on('data', (data) => {
    console.log(globalAny.hooked);
    console.log('Received data:', data.toString());
    // Convert buffer to string
    const dataString = data.toString();

    // Split the string at the double newline to separate headers from body
    const parts = dataString.split('\r\n\r\n');

    if (parts.length > 1) {
      const jsonPart = parts[1]; // The JSON body will be after the double newline

      try {
        const jsonData = JSONBig.parse(jsonPart);
        console.log('Extracted JSON:', jsonData);
        console.log(BigInt(jsonData.msgId).toString());
        // You can now work with the JSON data
        // For example, you could send it to the mainWindow in Electron:
        if (mainWindow) {
          mainWindow.webContents.send('displayMessage', jsonData);
        }

        socket.write('Message received\n');
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        socket.write('Error processing message\n');
      }
    } else {
      console.log('No JSON body found in the received data');
      socket.write('No JSON body found\n');
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Start listening on the shared port
server.listen(globalAny.sharedPort, () => {
  console.log(`TCP Server listening on port ${globalAny.sharedPort}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
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
ipcMain.handle('import-personal-keys', async (event, publicKey, privateKey) => {
  return KeyStore.importPersonalKeys(publicKey, privateKey);
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
ipcMain.handle('install-wechat', async () => {
  return HookDirect.installWeChat();
});
ipcMain.handle('anti-wechat-upgrade', async () => {
  return HookDirect.antiWeChatUpgrade();
});
ipcMain.handle('send-msg-hook', async (event, sendMsgHookSettings) => {
  console.log(sendMsgHookSettings);
  return HookDirect.sendMsg(sendMsgHookSettings);
});
ipcMain.handle('get-contact', async () => {
  return HookDirect.getContactList();
});
ipcMain.handle('get-logininfo', async () => {
  return HookDirect.getLoginInfo();
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
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
