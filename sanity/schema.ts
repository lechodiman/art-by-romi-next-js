import { defineField, defineType, type SchemaTypeDefinition } from 'sanity';

const paintingType = defineType({
  name: 'painting',
  title: 'Painting',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'image', type: 'image' }),
  ],
});

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [paintingType],
};
