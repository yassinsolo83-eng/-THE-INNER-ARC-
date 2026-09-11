import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { apiVersion, dataset, projectId } from './sanity/env'

const singletonTypes = new Set(['siteSettings', 'aboutPage'])

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem().title('Site Settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem().title('About Tarot Page').id('aboutPage').child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.divider(),
            // Collections
            ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId()!)),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
