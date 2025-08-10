import crypto from 'crypto';
import path from 'path';

export const createOtpCode = () => {
  return String(crypto.randomInt(100000, 1000000));
};

export const createFileName = (fileName: string) => {
  const ext = path.extname(fileName);
  return `${crypto.randomUUID()}${ext}`;
};
