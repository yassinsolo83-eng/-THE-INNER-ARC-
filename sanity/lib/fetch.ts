import { client } from './client'
import { isSanityConfigured } from '../env'

export async function sanityFetch<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!isSanityConfigured) return null
  try {
    return await client.fetch<T>(query, params ?? {}, {
      next: { revalidate: 60 },
    })
  } catch {
    return null
  }
}
