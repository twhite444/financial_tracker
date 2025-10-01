import { config } from 'dotenv';

config();

const securityConfig = {
    encryptionKey: process.env.ENCRYPTION_KEY || 'defaultEncryptionKey',
    tokenSecret: process.env.TOKEN_SECRET || 'defaultTokenSecret',
    tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
};

export default securityConfig;