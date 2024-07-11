import { defineType, defineField } from 'sanity';

export const paintingType = defineType({
  name: 'painting',
  title: 'Painting',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'image', type: 'image' }),
  ],
});
