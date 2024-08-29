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
    // Read the photo file
    const photoBuffer = fs.readFileSync(photoPath);

    // Encrypt the photo using the public key
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      photoBuffer,
    );

    // Generate a hash of the photo path and truncate it
    const hash = crypto
      .createHash('sha256')
      .update(photoPath)
      .digest('hex')
      .slice(0, 12);
    const tempPath = path.join(os.tmpdir(), `${hash}.enc`);

    // Write the encrypted file to the temporary directory
    fs.writeFileSync(tempPath, encrypted);

    return tempPath;
  }

  static decryptPhoto(encryptedPhotoPath: string, privateKey: string): string {
    // Read the encrypted file
    const encryptedBuffer = fs.readFileSync(encryptedPhotoPath);

    // Decrypt the file using the private key
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      encryptedBuffer,
    );

    // Extract the original file name from the encrypted file name
    const originalFileName = path.basename(encryptedPhotoPath, '.enc');
    const outputPath = path.join(
      path.dirname(encryptedPhotoPath),
      originalFileName,
    );

    // Write the decrypted file with the original file name
    fs.writeFileSync(outputPath, decrypted);

    return outputPath;
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
