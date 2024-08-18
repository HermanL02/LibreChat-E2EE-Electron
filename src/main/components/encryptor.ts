// Encryptor.ts
import crypto from 'crypto';

export default class Encryptor {
  static encrypt(text: string, publicKey: string): string {
    console.log(text);
    console.log(publicKey);
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(text),
    );
    console.log(encrypted);
    return encrypted.toString('base64');
  }

  static decrypt(encryptedText: string, privateKey: string): string {
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedText, 'base64'),
    );
    return decrypted.toString('utf8');
  }

  static generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });
    return { publicKey, privateKey };
  }
}
