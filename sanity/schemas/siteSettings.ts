import { defineType, defineField } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtítulo', type: 'string' }),
    {
      name: 'aboutMe',
      title: 'Acerca de mi',
      type: 'array',
      of: [{ type: 'block' }],
    },
    defineField({ name: 'heroImage', title: 'Imagen principal', type: 'image' }),
  ],
});
