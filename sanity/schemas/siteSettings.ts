import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', initialValue: 'The Inner Arc' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo (Light on Dark)', type: 'image' }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
