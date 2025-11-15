import * as Crypto from 'expo-crypto';

const SALT_LENGTH = 16;

export async function generateSalt(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(SALT_LENGTH);
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export function uint8ArrayToHex(array: Uint8Array): string {
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
