import { parseAsString, createSearchParamsCache } from 'nuqs/server'

// Define the parsers that can be shared between client and server
export const searchParsers = {
  q: parseAsString.withDefault('')
}

// Create a server-side cache for the search params
export const searchParamsCache = createSearchParamsCache(searchParsers) 