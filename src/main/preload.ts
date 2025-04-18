// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'show-dialog'
  | 'request-shared-port'
  | 'response-shared-port';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
contextBridge.exposeInMainWorld('electronAPI', {
  // keystore operations
  insertFriend: (name: String, publicKey: any) =>
    ipcRenderer.invoke('insert-friend', name, publicKey),
  importPersonalKeys: (publicKey: String, privateKey: any) =>
    ipcRenderer.invoke('import-personal-keys', publicKey, privateKey),
  // encryptor operations
  encrypt: (text: string, publicKey: string) =>
    ipcRenderer.invoke('encrypt', text, publicKey),
  decrypt: (encryptedText: string, privateKey: string) =>
    ipcRenderer.invoke('decrypt', encryptedText, privateKey),
  encryptPhoto: (photoPath: string, publicKey: string) =>
    ipcRenderer.invoke('encrypt-photo', photoPath, publicKey),
  decryptPhoto: (
    encryptedPhotoPath: string,
    privateKey: string,
    encryptedKey: string,
  ) =>
    ipcRenderer.invoke(
      'decrypt-photo',
      encryptedPhotoPath,
      privateKey,
      encryptedKey,
    ),
  generateKeyPair: () => ipcRenderer.invoke('generate-key-pair'),
  getAllFriends: () => ipcRenderer.invoke('get-all-friends'),
  updatePersonalKeys: () => ipcRenderer.invoke('update-personal-keys'),
  getPersonalKeys: () => ipcRenderer.invoke('get-personal-keys'),
  checkWechatLogin: () => ipcRenderer.invoke('check-wechat-login'),
  sendMessage: (message: any) => ipcRenderer.invoke('send-msg-hook', message),
  sendImage: (message: any) => ipcRenderer.invoke('send-image-hook', message),
  getContact: () => ipcRenderer.invoke('get-contact'),
  getLoginInfo: () => ipcRenderer.invoke('get-logininfo'),
  hookWechat: (hookSettings: any) =>
    ipcRenderer.invoke('hook-wechat', hookSettings),
  getMsgAttachment: (msgId: string) =>
    ipcRenderer.invoke('get-msg-attachment', msgId),
  antiWeChatUpgrade: () => ipcRenderer.invoke('anti-wechat-upgrade'),
  installWeChat: () => ipcRenderer.invoke('install-wechat'),
  receiveMessage: (callback: any) =>
    ipcRenderer.on('displayMessage', (event, message) => callback(message)),
});

export type ElectronHandler = typeof electronHandler;
