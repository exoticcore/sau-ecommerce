import crypto from 'crypto';

const { TOKEN_SECRET_KEY, TOKEN_SECRET_IV, TOKEN_ENCRYPT_METHOD } = process.env;

const key = crypto
  .createHash('sha512')
  .update(TOKEN_SECRET_KEY || 'secret')
  .digest('hex')
  .substring(0, 32);

const encryptionIV = crypto
  .createHash('sha512')
  .update(TOKEN_SECRET_IV || 'secretiv')
  .digest('hex')
  .substring(0, 16);

// Encrypt data
export const encryptData = (data: string): string => {
  const cipher = crypto.createCipheriv(
    TOKEN_ENCRYPT_METHOD || 'aes-256-cbc',
    key,
    encryptionIV
  );
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64');
};

// Decrypt data
export const decryptData = (enData: string): string => {
  const buff = Buffer.from(enData, 'base64');
  const decipher = crypto.createDecipheriv(
    TOKEN_ENCRYPT_METHOD || 'aes-256-cbc',
    key,
    encryptionIV
  );
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf-8') +
    decipher.final('utf8')
  );
};
