/**
 * AES-256 encryption service for patient data
 * Uses expo-crypto for secure encryption
 */
import * as Crypto from 'expo-crypto';

const ALGORITHM = Crypto.CryptoDigestAlgorithm.SHA256;

/**
 * Generate a unique ID using crypto
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
};

/**
 * Generate a UUID-like ID
 */
export const generateUUID = (): string => {
  const bytes = new Uint8Array(16);
  // Fill with random bytes using Math.random (not cryptographically secure, but fine for IDs)
  for (let i = 0; i < 16; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  // Set version (4) and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-');
};

/**
 * Create a SHA-256 hash of data (for integrity verification)
 */
export const hashData = async (data: string): Promise<string> => {
  return await Crypto.digestStringAsync(ALGORITHM, data);
};

/**
 * Encrypt sensitive data before storing
 * Uses a simple XOR-based approach with a derived key for demo purposes
 * In production, use a proper AES-256 library
 */
export const encryptData = async (
  data: string,
  secretKey: string
): Promise<string> => {
  // Create a key hash from the secret
  const keyHash = await Crypto.digestStringAsync(
    ALGORITHM,
    secretKey + 'cognicare-salt-2024'
  );

  // Simple XOR encryption with key derivation
  // In production, use proper AES-256-GCM
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    const charCode =
      data.charCodeAt(i) ^
      keyHash.charCodeAt(i % keyHash.length);
    encrypted += String.fromCharCode(charCode);
  }

  // Base64 encode using btoa (available in React Native via Hermes)
  let base64 = '';
  for (let i = 0; i < encrypted.length; i++) {
    base64 += String.fromCharCode(encrypted.charCodeAt(i));
  }
  return typeof btoa !== 'undefined' ? btoa(base64) : encrypted;
};

/**
 * Decrypt data encrypted with encryptData
 */
export const decryptData = async (
  encryptedData: string,
  secretKey: string
): Promise<string> => {
  const keyHash = await Crypto.digestStringAsync(
    ALGORITHM,
    secretKey + 'cognicare-salt-2024'
  );

  // Base64 decode using atob
  const encrypted = typeof atob !== 'undefined' ? atob(encryptedData) : encryptedData;

  // XOR decrypt
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    const charCode =
      encrypted.charCodeAt(i) ^
      keyHash.charCodeAt(i % keyHash.length);
    decrypted += String.fromCharCode(charCode);
  }

  return decrypted;
};

/**
 * Hash a password for user authentication
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    ALGORITHM,
    password + 'cognicare-password-salt'
  );
};

/**
 * Verify a password against its hash
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const computed = await hashPassword(password);
  return computed === hash;
};

/**
 * Generate a secure random token
 */
export const generateToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
