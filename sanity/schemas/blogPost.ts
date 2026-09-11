import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Journal Posts',
  type: 'document',
  icon: () => '📝',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 2 }),
    defineField({ name: 'publishedAt', title: 'Published Date', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'readTime', title: 'Read Time', type: 'string', description: 'e.g. "6 min read"' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading 2', value: 'h2' }, { title: 'Heading 3', value: 'h3' }, { title: 'Quote', value: 'blockquote' }] },
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] },
      ],
    }),
  ],
  orderings: [{ title: 'Published', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' },
  },
})
