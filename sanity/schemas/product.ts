const productSchema = {
  name: 'product',
  title: 'Productos',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descripción',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Precio',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [{ type: 'image' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Retratos', value: 'retratos' },
          // Agrega más categorías según necesites
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
  ],
};

export default productSchema;
