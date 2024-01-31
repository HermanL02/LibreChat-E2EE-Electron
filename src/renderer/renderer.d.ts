export interface IElectronAPI {
  // keystore operations
  insertFriend: (friendName: any, publicKey: any) => Promise<void>;
  // encryptor operations
  encrypt: (text: string, publicKey: string) => Promise<string>;
  decrypt: (encryptedText: string, privateKey: string) => Promise<string>;
  generateKeyPair: () => Promise<{ publicKey: string; privateKey: string }>;
  getAllFriends: () => Promise<any[]>;
  updatePersonalKeys: () => Promise<any>;
  getPersonalKeys: () => Promise<any>;
  checkWechatLogin: () => Promise<any>;
  hookWechat: (hookSettings: any) => Promise<any>;
  receiveMessage: (callback: any) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
