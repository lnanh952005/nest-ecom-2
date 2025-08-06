import z from 'zod';

export const createLanguageDto = z.strictObject({
  id: z.string(),
  name: z.string(),
});

export const updateLanguageDto = createLanguageDto.pick({
  name: true,
});

export type CreateLanguageDtoType = z.infer<typeof createLanguageDto>
export type UpdateLanguageDtoType = z.infer<typeof updateLanguageDto>
