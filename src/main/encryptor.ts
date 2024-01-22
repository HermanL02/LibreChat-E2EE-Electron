// Encryptor.ts
import crypto from 'crypto';

export default class Encryptor {
  private key: Buffer;

  private iv: Buffer;

  constructor() {
    this.key = crypto.randomBytes(32);
    this.iv = crypto.randomBytes(16);
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
