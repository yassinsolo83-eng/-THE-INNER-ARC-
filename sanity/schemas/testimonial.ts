import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Kind Words',
  type: 'document',
  icon: () => '💬',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Client Name/Initial', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'context', title: 'Context', type: 'string', description: 'e.g. "written reading" or "The Open Road"' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'quote' },
  },
})
