// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'show-dialog';

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
  // encryptor operations
  encrypt: (text: string, publicKey: string) =>
    ipcRenderer.invoke('encrypt', text, publicKey),
  decrypt: (encryptedText: string, privateKey: string) =>
    ipcRenderer.invoke('decrypt', encryptedText, privateKey),
  generateKeyPair: () => ipcRenderer.invoke('generate-key-pair'),
  getAllFriends: () => ipcRenderer.invoke('get-all-friends'),
  updatePersonalKeys: () => ipcRenderer.invoke('update-personal-keys'),
  getPersonalKeys: () => ipcRenderer.invoke('get-personal-keys'),
  checkWechatLogin: () => ipcRenderer.invoke('check-wechat-login'),
});

export type ElectronHandler = typeof electronHandler;
