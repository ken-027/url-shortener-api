import { CRYPT_ALGO } from "@/config/env";
import crypto from "node:crypto";

interface Encrypt {
    iv: string;
    encryptedData: string;
}

const ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

function toBase62(buffer: Buffer): string {
    let num = BigInt("0x" + buffer.toString("hex"));
    let str = "";
    while (num > 0) {
        str = ALPHABET[Number(num % BigInt(BASE))] + str;
        num = num / BigInt(BASE);
    }
    return str;
}

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export const encrypt = (text: string): Encrypt => {
    const cipher = crypto.createCipheriv(CRYPT_ALGO, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

export const decrypt = (text: Encrypt): string => {
    const decipherIv = Buffer.from(text.iv, "hex");
    const encryptedText = Buffer.from(text.encryptedData, "hex");
    const decipher = crypto.createDecipheriv(
        CRYPT_ALGO,
        Buffer.from(key),
        decipherIv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

export function encodeUrlToShortCode(url: string, length = 5): string {
    const hash = crypto.createHash("sha256").update(url).digest();
    const base62 = toBase62(hash);

    let code = base62.slice(0, length);

    if (!/[0-9]/.test(code)) {
        const numIndex = Number(
            BigInt("0x" + hash.toString("hex")) % BigInt(10),
        );
        const pos = Number(
            BigInt("0x" + hash.toString("hex")) % BigInt(length),
        );
        const chars = code.split("");
        chars[pos] = numIndex.toString();
        code = chars.join("");
    }

    return code;
}
