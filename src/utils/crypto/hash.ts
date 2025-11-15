import * as Crypto from 'expo-crypto';
import { generateSalt, hexToUint8Array, uint8ArrayToHex } from './salt';

const ITERATIONS = 10000;
const HASH_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = await generateSalt();
  const hash = await deriveKey(password, salt);

  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, storedHash] = hashedPassword.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const hash = await deriveKey(password, salt);

  return hash === storedHash;
}

function stringToBytes(str: string): Uint8Array {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(password: string, salt: string): Promise<string> {
  const passwordData = stringToBytes(password);
  const saltData = hexToUint8Array(salt);

  const combinedData = new Uint8Array(passwordData.length + saltData.length);
  combinedData.set(passwordData);
  combinedData.set(saltData, passwordData.length);

  let derived = combinedData;

  for (let i = 0; i < ITERATIONS; i++) {
    const hashResult = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      uint8ArrayToHex(derived)
    );
    const hashBytes = hexToUint8Array(hashResult);
    derived = new Uint8Array(hashBytes);
  }

  return uint8ArrayToHex(derived).substring(0, HASH_LENGTH);
}
