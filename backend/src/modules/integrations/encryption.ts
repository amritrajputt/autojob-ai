import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
// Derives a 32-byte key from the ENCRYPTION_SECRET env variable using SHA-256.
function getDerivedKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;

  if (!secret || secret.trim().length === 0) {
    throw new Error(
      "[encryption] ENCRYPTION_SECRET is not set. " +
        "Generate one with: openssl rand -hex 32"
    );
  }

  return crypto.createHash("sha256").update(secret).digest();
}

// Format for stored encrypted data: "<iv_hex>:<ciphertext_hex>"
export type EncryptedValue = string;

// Encrypts plaintext string using AES-256-CBC algorithm.
export function encrypt(plaintext: string): EncryptedValue {
  if (typeof plaintext !== "string" || plaintext.length === 0) {
    throw new TypeError("[encryption] plaintext must be a non-empty string");
  }

  const key = getDerivedKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

// Decrypts an AES-256-CBC encrypted value.
export function decrypt(encryptedValue: EncryptedValue): string {
  if (typeof encryptedValue !== "string" || !encryptedValue.includes(":")) {
    throw new TypeError(
      "[encryption] invalid encrypted value — expected '<iv_hex>:<ciphertext_hex>'"
    );
  }

  const [ivHex, ciphertextHex] = encryptedValue.split(":");

  if (!ivHex || !ciphertextHex) {
    throw new Error("[encryption] malformed encrypted value — missing iv or ciphertext");
  }

  const iv = Buffer.from(ivHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  if (iv.length !== IV_LENGTH) {
    throw new Error(
      `[encryption] IV length mismatch — expected ${IV_LENGTH} bytes, got ${iv.length}`
    );
  }

  const key = getDerivedKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

// Re-encrypts an encrypted value using the current secret key.
export function reEncrypt(encryptedValue: EncryptedValue): EncryptedValue {
  return encrypt(decrypt(encryptedValue));
}

// Checks if a string matches the "<hex>:<hex>" encrypted format.
export function isEncryptedValue(value: string): boolean {
  const HEX_PATTERN = /^[0-9a-f]+:[0-9a-f]+$/i;
  return HEX_PATTERN.test(value);
}

// Encrypts a Groq API key.
export function encryptApiKey(apiKey: string): EncryptedValue {
  return encrypt(apiKey);
}

// Decrypts a Groq API key.
export function decryptApiKey(encrypted: EncryptedValue): string {
  return decrypt(encrypted);
}

// Encrypts a session cookie.
export function encryptSessionCookie(cookie: string): EncryptedValue {
  return encrypt(cookie);
}

// Decrypts a session cookie.
export function decryptSessionCookie(encrypted: EncryptedValue): string {
  return decrypt(encrypted);
}