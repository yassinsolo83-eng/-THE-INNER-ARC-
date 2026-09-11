import createImageUrlBuilder from '@sanity/image-url'
import { client } from './client'
export function urlFor(source: any) { return client ? createImageUrlBuilder(client).image(source) : null }
