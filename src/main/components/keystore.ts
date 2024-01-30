import { friendsDB, personalDB } from './db';
import Encryptor from './encryptor';
// 等待重构这个，因为我想把date统一放在后端生成
type Friend = {
  name: string;
  publicKeys: [string, Date][];
};
export default class KeyStore {
  // friends operations
  static async insertFriend(name: string, publickey: string): Promise<any> {
    const date = new Date().getTime();
    const publicKeys = [{ publickey, date }];
    const doc = { name, publicKeys };

    return new Promise((resolve, reject) => {
      friendsDB.insert(doc, (err, newDoc) => {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc);
        }
      });
    });
  }

  static async getAllFriends(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      friendsDB.find({}, (err: Error, docs: Friend[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  static async modifyKey(
    _id: string,
    publicKeys: [string, Date][],
  ): Promise<void> {
    const doc = { publicKeys };
    return new Promise((resolve, reject) => {
      friendsDB.update({ _id }, { $set: doc }, { upsert: true }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static async getKey(_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      friendsDB.findOne({ _id }, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  // personal operations
  static async updatePersonalKeys(): Promise<any> {
    const { publicKey, privateKey } = Encryptor.generateKeyPair();
    const doc = { publicKey, privateKey, date: new Date().getTime() };

    return new Promise((resolve, reject) => {
      personalDB.insert(doc, (err, newDoc) => {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc);
        }
      });
    });
  }

  static async getPersonalKeys(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      personalDB.find(
        {},
        (err: Error | null, docs: any[] | PromiseLike<any[]>) => {
          if (err) reject(err);
          else resolve(docs);
        },
      );
    });
  }
}
