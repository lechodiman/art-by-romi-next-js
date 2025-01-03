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
      type: 'object',
      fields: [
        defineField({ name: 'image', title: 'Imagen', type: 'image' }),
        {
          name: 'text',
          title: 'Texto',
          type: 'array',
          of: [{ type: 'block' }],
        },
      ],
    },
    defineField({ name: 'heroImage', title: 'Imagen principal', type: 'image' }),
    {
      name: 'faqItems',
      title: 'Preguntas Frecuentes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', type: 'string' }),
            defineField({ name: 'answer', type: 'text' }),
          ],
        },
      ],
    },
    {
      name: 'testimonials',
      title: 'Testimonios',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      validation: (Rule) => Rule.max(3),
    },
    {
      name: 'featuredPaintings',
      title: 'Featured Paintings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'painting' }] }],
      validation: (Rule) => Rule.max(4),
    },
    {
      name: 'differentiators',
      title: 'Diferenciadores',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({ name: 'description', title: 'Descripción', type: 'text' }),
            defineField({ name: 'image', title: 'Imagen', type: 'image' }),
            defineField({
              name: 'imagePosition',
              title: 'Posición de imagen',
              type: 'string',
              options: {
                list: [
                  { title: 'Izquierda', value: 'left' },
                  { title: 'Derecha', value: 'right' },
                ],
              },
            }),
          ],
        },
      ],
    },
  ],
});
