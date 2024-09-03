import { type SchemaTypeDefinition } from 'sanity';
import { siteSettingsType } from './schemas/siteSettings';
import { paintingType } from './schemas/painting';
import { testimonialType } from './schemas/testimonial';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettingsType, paintingType, testimonialType],
};
