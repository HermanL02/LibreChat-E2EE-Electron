// KeyStore.ts
import { friendsDB, personalDB } from './db';

class KeyStore {
  // friends operations
  static insertFriend(
    name: string,
    publicKeys: [string, Date][],
    callback: (err: Error | null, newDoc?: any) => void,
  ) {
    const doc = {
      name,
      publicKeys,
    };

    friendsDB.insert(doc, callback);
  }

  static modifyKey(
    _id: string,
    publicKeys: [string, Date][],
    callback: (err: Error | null) => void,
  ) {
    const doc = { publicKeys };
    friendsDB.update({ _id }, { $set: doc }, { upsert: true }, callback);
  }

  static getKey(_id: string, callback: (err: Error | null, doc: any) => void) {
    friendsDB.findOne({ _id }, callback);
  }

  // personal operations
  static getPersonalKeys(callback: (err: Error | null, docs: any[]) => void) {
    personalDB.find({}, (err: Error | null, docs: any[]) => {
      if (err) {
        callback(err, []);
      } else {
        callback(null, docs);
      }
    });
  }
}

export default KeyStore;
