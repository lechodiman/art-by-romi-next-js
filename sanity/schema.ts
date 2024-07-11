import { paintingType } from '@/sanity/schemas/painting';
import { siteSettingsType } from '@/sanity/schemas/siteSettings';
import { type SchemaTypeDefinition } from 'sanity';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [paintingType, siteSettingsType],
};
