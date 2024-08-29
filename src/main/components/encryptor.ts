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
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedText, 'base64'),
    );
    return decrypted.toString('utf8');
  }

  static encrypt2(text: Buffer, publicKey: string): string {
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      text,
    );
    return encrypted.toString('base64');
  }

  static decrypt2(encryptedText: string, privateKey: string): Buffer {
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedText, 'base64'),
    );
    return decrypted;
  }

  static encryptPhoto(
    photoPath: string,
    publicKey: string,
  ): { encryptedPath: string; encryptedKey: string } {
    // Generate a random symmetric encryption key (AES) - 128-bit key
    const symmetricKey = crypto.randomBytes(16); // 128-bit key for AES-128

    // Read the photo file
    const photoBuffer = fs.readFileSync(photoPath);

    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(16);

    // Encrypt the photo using the symmetric key and IV
    const cipher = crypto.createCipheriv('aes-128-cbc', symmetricKey, iv);
    const encryptedPhoto = Buffer.concat([
      cipher.update(photoBuffer),
      cipher.final(),
    ]);

    // Prepend the IV to the encrypted photo
    const encryptedPhotoWithIv = Buffer.concat([iv, encryptedPhoto]);

    // Encrypt the symmetric key using the public key
    const encryptedKey = this.encrypt2(symmetricKey, publicKey);

    // Generate a hash for the photo path and truncate it
    const hash = crypto
      .createHash('sha256')
      .update(photoPath)
      .digest('hex')
      .slice(0, 12);
    const tempPath = path.join(os.tmpdir(), `${hash}.enc`);

    // Write the encrypted photo to a temporary directory
    fs.writeFileSync(tempPath, encryptedPhotoWithIv);

    return {
      encryptedPath: tempPath,
      encryptedKey,
    };
  }

  static decryptPhoto(
    encryptedPhotoPath: string,
    privateKey: string,
    encryptedKey: string,
  ): string {
    // Decrypt the symmetric key using the private key
    const symmetricKey = this.decrypt2(encryptedKey, privateKey);
    console.log('99999999999999999');
    // Read the encrypted photo file
    const encryptedBuffer = fs.readFileSync(encryptedPhotoPath);

    // Extract the IV from the encrypted file
    const iv = encryptedBuffer.slice(0, 16);
    const encryptedPhoto = encryptedBuffer.slice(16);

    // Decrypt the photo using the symmetric key and IV
    const decipher = crypto.createDecipheriv('aes-128-cbc', symmetricKey, iv);
    const decryptedPhoto = Buffer.concat([
      decipher.update(encryptedPhoto),
      decipher.final(),
    ]);

    // Generate the output file path
    const originalFileName = path.basename(encryptedPhotoPath, '.enc');
    const outputPath = path.join(
      path.dirname(encryptedPhotoPath),
      `${originalFileName}.jpg`,
    );

    // Write the decrypted photo to the output path
    fs.writeFileSync(outputPath, decryptedPhoto);
    function getBase64FromFile(filePath: fs.PathOrFileDescriptor) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const base64String = fileBuffer.toString('base64');

        return `data:image/jpeg;base64,${base64String}`;
      } catch (err) {
        console.error('Failed to read file:', err);
        return null;
      }
    }

    const base64Image = getBase64FromFile(outputPath);

    console.log(base64Image);
    return base64Image || '';
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
