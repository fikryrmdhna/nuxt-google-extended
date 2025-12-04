/* eslint-disable node/prefer-global/process */
import type { SearchClient } from 'algoliasearch'
import type { Pagination } from '../article/type'
import type { AlgoliaHitArticle, AlgoliaHitGroup, AlgoliaSearch } from './type'

export async function searchAlgoliaArticles(
  nuxtApp: ReturnType<typeof useNuxtApp>,
  config: ReturnType<typeof useRuntimeConfig>,
  params: AlgoliaSearch,
) {
  const { query = '', page = 0, hitsPerPage = 15, filters = '' } = params

  if (query && /^[^a-z0-9]+$/i.test(query)) {
    return {
      response: [],
      pagination: {
        total: 0,
        count: 0,
        per_page: hitsPerPage,
        current_page: page + 1,
        total_pages: 0,
        next_page: '',
        previous_page: '',
      },
    }
  }

  try {
    const c = nuxtApp.$algolia as SearchClient
    const articlesIndex = config.public.algolia.searchArticlesIndex as string

    const index = c.initIndex(articlesIndex)

    const response = await index.search<AlgoliaHitArticle>(query, {
      filters,
      hitsPerPage,
      page,
    })

    // algolia pagination using slightly different counting
    const pagination: Pagination = {
      total: response.nbHits,
      count: response.nbHits,
      per_page: hitsPerPage,
      current_page: page + 1,
      total_pages: response.nbPages - 1,
      next_page: '',
      previous_page: '',
    }

    saveSearchQuery(query)

    return {
      response: response.hits,
      pagination,
    }
  }
  catch (err) {
    console.error('Articles Algolia Search Failed: ', err)
    throw new Error('Articles Algolia search failed.')
  }
}

export async function searchSimilarTags(
  nuxtApp: ReturnType<typeof useNuxtApp>,
  config: ReturnType<typeof useRuntimeConfig>,
  params: AlgoliaSearch,
) {
  const { query = '', hitsPerPage = 5 } = params
  const c = nuxtApp.$algolia as SearchClient
  const articlesIndex = config.public.algolia.searchArticlesIndex as string

  const index = c.initIndex(articlesIndex)

  const response = await index.searchForFacetValues('tag_article', query, {
    maxFacetHits: hitsPerPage,
  })

  return {
    response: response.facetHits,
  }
}

export async function searchAlgoliaGroups(
  nuxtApp: ReturnType<typeof useNuxtApp>,
  config: ReturnType<typeof useRuntimeConfig>,
  params: AlgoliaSearch,
) {
  const { query = '', page = 0, hitsPerPage = 15, filters = '' } = params

  if (query && /^[^a-z0-9]+$/i.test(query)) {
    return {
      response: [],
      pagination: {
        total: 0,
        count: 0,
        per_page: hitsPerPage,
        current_page: page + 1,
        total_pages: 0,
        next_page: '',
        previous_page: '',
      },
    }
  }

  try {
    const algo = nuxtApp.$algolia as SearchClient
    const groupsIndex = config.public.algolia.searchGroupsIndex as string

    const index = algo.initIndex(groupsIndex)

    const response = await index.search<AlgoliaHitGroup>(query, {
      filters,
      hitsPerPage,
      page,
    })

    // algolia pagination using slightly different counting
    const pagination: Pagination = {
      total: response.nbHits,
      count: response.nbHits,
      per_page: hitsPerPage,
      current_page: page + 1,
      total_pages: response.nbPages - 1,
      next_page: '',
      previous_page: '',
    }

    saveSearchQuery(query)

    return {
      response: response.hits,
      pagination,
    }
  }
  catch (err) {
    console.error('Group Algolia Search Failed: ', err)
    throw new Error('Group Algolia search failed.')
  }
}

// Function to get recent searches from local storage
export function getRecentSearches() {
  if (!process.client) return
  try {
    const searches = localStorage.getItem('RECENT_SEARCHES_ALGOLIA')
    return searches ? JSON.parse(searches) : []
  }
  catch (err) {
    console.warn('LocalStorage not accessible:', err)
    return []
  }
}

// Function to save a new search query
function saveSearchQuery(query: string) {
  if (!process.client) return
  if (!query.trim()) return

  try {
    const recentSearches = getRecentSearches()

    // Remove the query if it already exists
    const existingIndex = recentSearches.indexOf(query)
    if (existingIndex !== -1) {
      recentSearches.splice(existingIndex, 1)
    }

    // Add the new query at the beginning
    recentSearches.unshift(query)

    // Limit the number of stored searches
    const maxSearches = 5
    if (recentSearches.length > maxSearches) {
      recentSearches.splice(maxSearches)
    }

    // Save back to local storage
    localStorage.setItem('RECENT_SEARCHES_ALGOLIA', JSON.stringify(recentSearches))
  }
  catch (err) {
    console.warn('Failed to save search query:', err)
  }
}
