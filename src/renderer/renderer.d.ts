export interface IElectronAPI {
  // keystore operations
  insertFriend: (friendName: any, publicKey: any) => Promise<void>;
  importPersonalKeys: (publicKey: any, privateKey: any) => Promise<any>;
  // encryptor operations
  encrypt: (text: string, publicKey: string) => Promise<string>;
  encryptPhoto: (photoPath: string, publicKey: string) => Promise<any>;
  decryptPhoto: (
    encryptedPhotoPath: string,
    privateKey: string,
  ) => Promise<any>;
  decrypt: (encryptedText: string, privateKey: string) => Promise<string>;
  generateKeyPair: () => Promise<{ publicKey: string; privateKey: string }>;
  getAllFriends: () => Promise<any[]>;
  updatePersonalKeys: () => Promise<any>;
  getPersonalKeys: () => Promise<any>;
  checkWechatLogin: () => Promise<any>;
  hookWechat: (hookSettings: any) => Promise<any>;
  antiWeChatUpgrade: () => Promise<any>;
  installWeChat: () => Promise<any>;
  receiveMessage: (callback: any) => Promise<any>;
  sendMessage: (message: any) => Promise<any>;
  sendImage: (message: any) => Promise<any>;
  getContact: () => Promise<any>;
  getLoginInfo: () => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
