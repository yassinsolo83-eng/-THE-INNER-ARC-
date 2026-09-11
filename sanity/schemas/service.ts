import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Readings',
  type: 'document',
  icon: () => '🃏',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'image' },
  },
})
