import crypto from 'crypto';

export const createOtpCode = () => {
  return String(crypto.randomInt(100000, 1000000));
};
