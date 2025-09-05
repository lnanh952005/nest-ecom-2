import { createZodDto } from 'nestjs-zod';
import { languageSchema } from '@language/language.schema';

const createLanguageDto = languageSchema
  .pick({
    id: true,
    name: true,
  })
  .strict();

const updateLanguageDto = createLanguageDto.pick({
  name: true,
});

export class CreateLanguageDto extends createZodDto(createLanguageDto) {}
export class UpdateLanguageDto extends createZodDto(updateLanguageDto) {}
