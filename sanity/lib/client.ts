import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId, isSanityConfigured } from '../env'

export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null
