import { client } from './client'
import { isSanityConfigured } from '../env'
export async function sanityFetch<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!isSanityConfigured || !client) return null
  try { return await client.fetch<T>(query, params ?? {}) } catch { return null }
}
