import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.coerce.date(),
    etiqueta: z.string(),
    destacado: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
