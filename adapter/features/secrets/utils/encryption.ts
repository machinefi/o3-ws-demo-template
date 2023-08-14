import { EncryptedToken } from "@/types";
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPT_KEY || crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encrypt(text: string): EncryptedToken {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("base64url"),
    encryptedData: encrypted.toString("base64url"),
  };
}

export function decrypt(encryptedObj: EncryptedToken) {
  const ivp = Buffer.from(encryptedObj.iv, "base64url");
  const encryptedText = Buffer.from(encryptedObj.encryptedData, "base64url");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivp);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
