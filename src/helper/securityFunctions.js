import crypto from 'crypto';
import dotenv from "dotenv";

dotenv.config();

// Your secret key (must be 32 bytes for AES-256)
// const key = crypto.createHash('sha256').update(process.env.NEXT_PUBLIC_ENCRYPTION_SECRET).digest();
const key = crypto.createHash('sha256').update('powerband@aus').digest();

export const encryptPassword = (password) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return {
        encryptedPassword: encrypted,
        iv: iv.toString('base64')
    };
}

export const decryptPassword = (encryptedPassword, ivBase64) => {
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedPassword, 'base64', 'utf8');

    decrypted += decipher.final('utf8');
    return decrypted;
}
