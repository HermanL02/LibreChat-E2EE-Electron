// Encryptor.ts
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';

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
    console.log(privateKey);
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedText, 'base64'),
    );
    return decrypted.toString('utf8');
  }

  static encryptPhoto(photoPath: string, publicKey: string): string {
    const photoBuffer = fs.readFileSync(photoPath);
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      photoBuffer,
    );
    const tempPath = path.join(os.tmpdir(), 'encrypted_photo.enc');
    fs.writeFileSync(tempPath, encrypted);
    return tempPath;
  }

  static decryptPhoto(encryptedPhoto: string, privateKey: string): string {
    const encryptedBuffer = fs.readFileSync(encryptedPhoto);
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      encryptedBuffer,
    );
    const outputPhotoPath = path.join(os.tmpdir(), 'decrypted_photo.jpg');
    fs.writeFileSync(outputPhotoPath, decrypted);
    return outputPhotoPath;
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
