import { friendsDB, personalDB } from './db';

class KeyStore {
  // friends operations
  static async insertFriend(
    name: string,
    publicKeys: [string, Date][],
  ): Promise<any> {
    console.log('Inserting friend:', name, publicKeys);
    const doc = { name, publicKeys };

    return new Promise((resolve, reject) => {
      friendsDB.insert(doc, (err, newDoc) => {
        if (err) {
          console.error('Error inserting friend:', err);
          reject(err);
        } else {
          console.log('Friend inserted successfully:', newDoc);
          resolve(newDoc);
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
