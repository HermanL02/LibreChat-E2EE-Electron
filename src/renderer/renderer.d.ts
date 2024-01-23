export interface IElectronAPI {
  insertFriend: (friendName: any, publicKeys: any) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
