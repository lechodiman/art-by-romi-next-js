import { defineType, defineField } from 'sanity'

export const pricingConfig = defineType({
  name: 'pricingConfig',
  title: 'Configuración de Precios',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Nombre descriptivo de esta configuración',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'extraPets',
      title: 'Precios por Mascotas Adicionales',
      type: 'object',
      fields: [
        defineField({
          name: 'onePet',
          title: 'Una Mascota Extra',
          type: 'number',
          description: 'Precio adicional por una mascota extra',
          validation: Rule => Rule.required().min(0)
        }),
        defineField({
          name: 'twoPets',
          title: 'Dos Mascotas Extra',
          type: 'number',
          description: 'Precio adicional por dos mascotas extra',
          validation: Rule => Rule.required().min(0)
        })
      ]
    }),
    defineField({
      name: 'specialBackground',
      title: 'Precio Fondo Especial',
      type: 'number',
      description: 'Precio adicional por fondo personalizado',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'framePrices',
      title: 'Precios de Marcos',
      type: 'object',
      fields: [
        defineField({
          name: 'mini',
          title: 'Marco Mini',
          type: 'number',
          description: 'Precio del marco para tamaño mini',
          validation: Rule => Rule.required().min(0)
        }),
        defineField({
          name: 'medium',
          title: 'Marco Mediano',
          type: 'number',
          description: 'Precio del marco para tamaño mediano',
          validation: Rule => Rule.required().min(0)
        }),
        defineField({
          name: 'large',
          title: 'Marco Grande',
          type: 'number',
          description: 'Precio del marco para tamaño grande',
          validation: Rule => Rule.required().min(0)
        })
      ]
    }),
    defineField({
      name: 'isActive',
      title: 'Activo',
      type: 'boolean',
      description: 'Solo una configuración puede estar activa a la vez',
      validation: Rule => Rule.required(),
      initialValue: false
    }),
    defineField({
      name: 'validFrom',
      title: 'Válido Desde',
      type: 'datetime',
      description: 'Fecha y hora desde cuando esta configuración es válida',
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'name',
      isActive: 'isActive',
      validFrom: 'validFrom'
    },
    prepare(selection) {
      const { title, isActive, validFrom } = selection
      return {
        title: title,
        subtitle: `${isActive ? '✓ Activa' : 'Inactiva'} - Desde: ${new Date(validFrom).toLocaleDateString('es-CL')}`
      }
    }
  }
})