export interface IElectronAPI {
  // keystore operations
  insertFriend: (friendName: any, publicKeys: any) => Promise<void>;
  // encryptor operations
  encrypt: (text: string, publicKey: string) => Promise<string>;
  decrypt: (encryptedText: string, privateKey: string) => Promise<string>;
  generateKeyPair: () => Promise<{ publicKey: string; privateKey: string }>;
  getAllFriends: () => Promise<any[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
