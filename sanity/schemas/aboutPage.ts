import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Tarot Page',
  type: 'document',
  icon: () => '📖',
  fields: [
    defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string' }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'heading', title: 'Heading', type: 'string' }),
          defineField({ name: 'body', title: 'Body', type: 'text', rows: 6 }),
        ],
        preview: { select: { title: 'heading' } },
      }],
    }),
    defineField({ name: 'sideQuote', title: 'Side Quote', type: 'string' }),
  ],
  preview: {
    prepare: () => ({ title: 'About Tarot Page' }),
  },
})
