import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Readers (Partners)',
  type: 'document',
  icon: () => '🙏',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'specialty', title: 'Specialty Tagline', type: 'string' }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: [{ title: 'Love & relationships', value: 'Love & relationships' }, { title: 'Career & purpose', value: 'Career & purpose' }, { title: 'Life & direction', value: 'Life & direction' }, { title: 'Shadow work', value: 'Shadow work' }] },
    }),
    defineField({ name: 'yearsExperience', title: 'Years of Experience', type: 'number' }),
    defineField({ name: 'featured', title: 'Featured?', type: 'boolean', initialValue: false }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4 }),
    defineField({ name: 'approach', title: 'Approach to Reading', type: 'text', rows: 4 }),
    defineField({ name: 'readings', title: 'Available Readings', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 2 }),
        defineField({ name: 'name', title: 'Client Name', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'specialty', media: 'photo' },
  },
})
