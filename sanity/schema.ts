import { type SchemaTypeDefinition } from 'sanity';
import { siteSettingsType } from './schemas/siteSettings';
import { paintingType } from './schemas/painting';
import { testimonialType } from './schemas/testimonial';
import product from './schemas/product';
import { pricingConfig } from './schemas/pricingConfig';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettingsType, paintingType, testimonialType, product, pricingConfig],
};
