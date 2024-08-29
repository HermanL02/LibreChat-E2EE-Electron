import fs from 'fs';
import Encryptor from './encryptor';

// Replace these with the actual RSA keys

const keypair = Encryptor.generateKeyPair();
const { publicKey } = keypair;
const { privateKey } = keypair;
const photoPath = 'C:\\Users\\liang\\Desktop\\Master Presentation Prep.jpg';

function testEncryptAndDecryptPhoto() {
  // Encrypt the photo
  const { encryptedPath, encryptedKey } = Encryptor.encryptPhoto(
    photoPath,
    publicKey,
  );
  console.log(`Encrypted photo saved to: ${encryptedPath}`);
  console.log(`Encrypted key: ${encryptedKey}`);

  // Decrypt the photo
  const decryptedPath = Encryptor.decryptPhoto(
    encryptedPath,
    privateKey,
    encryptedKey,
  );
  console.log(`Decrypted photo saved to: ${decryptedPath}`);

  // Optionally, check if the decrypted photo is identical to the original photo
  const originalPhotoBuffer = fs.readFileSync(photoPath);
  const decryptedPhotoBuffer = fs.readFileSync(decryptedPath);

  if (originalPhotoBuffer.equals(decryptedPhotoBuffer)) {
    console.log('Success: The decrypted photo matches the original photo!');
  } else {
    console.log(
      'Error: The decrypted photo does not match the original photo.',
    );
  }
}

// Run the test
testEncryptAndDecryptPhoto();
