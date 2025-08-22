import { languageSchema } from '@share/schemas/language.schema';

export const createLanguageDto = languageSchema
  .pick({
    id: true,
    name: true,
  })
  .strict();

export const updateLanguageDto = createLanguageDto.pick({
  name: true,
});
