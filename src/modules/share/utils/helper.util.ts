import { faker } from '@faker-js/faker';
import crypto from 'crypto';
import path from 'path';

export const createOtpCode = () => {
  return String(crypto.randomInt(100000, 1000000));
};

export const createFileName = (fileName: string) => {
  const ext = path.extname(fileName);
  return `${crypto.randomUUID()}${ext}`;
};

export const createVnPhone = () => {
  const prefixes = ['03', '05', '07', '08', '09'];
  const prefix = faker.helpers.arrayElement(prefixes);
  const number = faker.string.numeric(8); // 8 số còn lại
  return prefix + number;
};
