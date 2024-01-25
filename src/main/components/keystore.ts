import { friendsDB, personalDB } from './db';

type Friend = {
  name: string;
  publicKeys: [string, Date][];
};
class KeyStore {
  // friends operations
  static async insertFriend(
    name: string,
    publicKeys: [string, Date][],
  ): Promise<any> {
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

export default KeyStore;
