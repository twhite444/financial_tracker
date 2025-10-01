export class EncryptionService {
    private static algorithm: string = 'aes-256-cbc';
    private static key: Buffer = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    private static iv: Buffer = Buffer.alloc(16, 0); // Initialization vector

    public static encrypt(text: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    public static decrypt(encryptedText: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}