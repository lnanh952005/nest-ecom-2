import { SetMetadata } from '@nestjs/common';

export const MESSAGE_METADATA_KEY = 'MESSAGE_METADATA_KEY';
export const Message = (message: string) =>
  SetMetadata(MESSAGE_METADATA_KEY, message);
