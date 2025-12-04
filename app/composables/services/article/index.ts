import type { ArticleDetail, ArticleFormat, ArticleUser, Groups, HomepageSettingParams, HomepageSettingResponse } from './type'
import type { ArticleCategory, ArticleList, ArticleShortcut } from '../../../types/article'
import { constructMultipleQueryString } from '../../../lib/utils'
import type { ApiResponse } from '../../../types/apiResponse'

const baseUrl = '/api/gateway'

// get articles
export async function useArticles(concat: string = '', params: string = '') {
  const { $api } = useNuxtApp()
  const data = await $api(`${baseUrl}/articles?order_published_at=DESC&content_category=${concat}&${params}`)
  return data
}

// get article subrubric
export async function useArticleSubrubric(id: number) {
  const { $api } = useNuxtApp()
  const data = await $api(`${baseUrl}/articles?order_published_at=DESC&vip_indices=0&sub_rubric_id=${id}&page_size=3&is_active=true&status=published`)
  return data
}

// get latest
export async function useLatest(params: string = 'limit=5') {
  let url = `${baseUrl}/articles/latest-news?accesses=FREE&accesses=FREEMIUM&accesses=VIP`
  if (params) {
    url += `&${params}`
  }
  const { $api } = useNuxtApp()
  const data = await $api<ApiResponse.Success<ArticleList[]>>(url)
  return data
}

// get articles
export async function useArticlesByFilter(params: {
  tags?: string[]
  page?: number
  format_article_id?: string
  limit?: number
  accesses?: string[]
  status?: string
  sub_rubric_alias?: string
  page_size?: number
  order_published_at?: string
  content_category?: string
  published_at?: string
  sub_rubric_id?: string
  rubric_slug?: string
  start_date?: string
  end_date?: string

} = {}) {
  try {
    const {
      tags = [],
      page = 1,
      format_article_id,
      limit = 10,
      accesses = [],
      status = 'published',
      sub_rubric_alias,
      page_size,
      order_published_at,
      content_category,
      sub_rubric_id,
      published_at,
      rubric_slug,
      start_date,
      end_date,
    } = params

    const queryParams = new URLSearchParams()

    // Add status
    queryParams.append('status', status)

    // Add tags
    tags.forEach(tag => queryParams.append('tags[]', tag))

    // Add format_article_id if provided
    if (format_article_id) {
      queryParams.append('format_article_id', format_article_id)
    }

    // Add limit
    queryParams.append('limit', limit.toString())

    // Add accesses
    accesses.forEach(access => queryParams.append('access', access))

    if (start_date) {
      queryParams.append('start_date', start_date)
    }

    if (end_date) {
      queryParams.append('end_date', end_date)
    }

    // Add Sub Rubric ID
    if (sub_rubric_id) {
      queryParams.append('sub_rubric_id', sub_rubric_id)
    }

    // Add page
    queryParams.append('page', page.toString())

    // Add Sub Rubric
    if (sub_rubric_alias) {
      queryParams.append('sub_rubric_alias', sub_rubric_alias)
    }

    // Add Page Size
    if (page_size) {
      queryParams.append('page_size', page_size.toString())
    }

    // Add Order Published At
    if (order_published_at) {
      queryParams.append('order_published_at', order_published_at)
    }

    // Add Content Category
    if (content_category) {
      queryParams.append('content_category', content_category)
    }

    // Add Published At
    if (published_at) {
      queryParams.append('published_at', published_at)
    }

    // Add Rubric
    if (rubric_slug) {
      queryParams.append('rubric_slug', rubric_slug)
    }

    const { $api } = useNuxtApp()
    const url = `${baseUrl}/articles?${queryParams.toString()}`

    const data = await $api(url)
    return data
  }
  catch (error) {
    console.warn('error useArticlesByFilter', error)
  }
}

// get trending
export async function useArticleTrending(rubric_slug: string = '', params: string = '') {
  let url = `${baseUrl}/articles-trending/${rubric_slug}`
  if (params) {
    url += `?${params}`
  }

  try {
    const { $api } = useNuxtApp()
    const data = await $api(url)
    return data
  }
  catch (error) {
    console.warn('error useArticleTrending', error)
  }
}

// get popular
export async function usePopular() {
  const { $api } = useNuxtApp()
  const data = await $api(`${baseUrl}/articles/popular-news?limit=5&vip-indices=1&vip-indices=2&order=DESC&accesses=FREE&accesses=FREEMIUM`)
  return data
}

// get lapsus
export async function useLapsus(params: Record<string, any> = {}) {
  const { $api } = useNuxtApp()
  const queryParams = {
    is_active: true,
    page: 1,
    page_size: 5,
    ...useOmit(params, ['category']),
  }

  let url = `${baseUrl}/groups?category=fokus`

  const queryString = new URLSearchParams(queryParams as Record<string, any>)

  url = (!isEmpty(queryString.toString())) ? `${url}&${queryString.toString()}` : url
  const data = await $api<ApiResponse.Success<Groups>>(url)
  return data
}

// get group with article
export async function useGroupWithArticle(id: string = '', params: Record<string, any> = {}) {
  const { $api } = useNuxtApp()
  const queryParams = {
    is_active: true,
    page: 1,
    page_size: 5,
    ...useOmit(params),
  }

  let url = `${baseUrl}/groups/${id}/articles`

  const queryString = new URLSearchParams(queryParams as Record<string, any>)

  url = (!isEmpty(queryString.toString())) ? `${url}?${queryString.toString()}` : url
  const data = await $api<ApiResponse.Success<Groups>>(url)
  return data
}

// get article id
export async function useArticleId(id: string = '') {
  try {
    const { $api } = useNuxtApp()
    const data = await $api<ApiResponse.Success<ArticleDetail>>(`${baseUrl}/articles/${id}/detail`)
    return data
  }
  catch (error) {
    console.warn('error useArticleId', error)
  }
}

// get article id with token
export async function useArticleIdByToken(id: number | undefined) {
  const token = useAuth().token.value || ''
  const cleanToken = token.replace('Bearer ', '')

  try {
    const { $api } = useNuxtApp()
    const config = useRuntimeConfig()
    const data = await $api<ApiResponse.Success<ArticleDetail>>(
      `${baseUrl}/articles/${id}/detail`,
      {
        method: 'GET',
        headers: {
          'X-REMP-Token': cleanToken || '',
          'X-Platform-Token': config.public.token || '',
        },
      },
    )

    return data
  }
  catch (error) {
    console.warn('error useArticleIdWithToken', error)
  }
}

// get group's article by group slug
// export async function useGroupArticleByGroupSlug(
//   params: string = '',
//   query: string = 'limit=5&vip-indices=0&vip-indices=2&accesses=FREE&accesses=FREEMIUM',
// ) {
//   let url = `${baseUrl}/articles/group?group_slug=${params}`
//   if (query) {
//     url += `&${query}`
//   }
//   const data = await $api(url)
//   return data
// }

// get articles vip by rubric
export async function useArticlePlus(slug: string = '') {
  const { $api } = useNuxtApp()
  const url = slug === 'eksplainer'
    ? `${baseUrl}/articles?order_published_at=DESC&limit=10&access=VIP&page=1&page_size=20&content_category=${slug}`
    : `${baseUrl}/articles?order_published_at=DESC&access=VIP&rubric_slug=${slug}&page_size=20`
  const data = await $api(url)
  return data
}

// get rubric articles by category
export async function useRubricArticles(slug: string = '', params: string = 'vip-indices=0&vip-indices=2&limit=5&order=DESC') {
  let url = `${baseUrl}/articles/rubric/${slug}?accesses=FREE&accesses=FREEMIUM`
  if (params) {
    url += `&${params}`
  }
  try {
    const { $api } = useNuxtApp()
    const data = await $api<ApiResponse.Success<ArticleList[]>>(url)
    return data
  }
  catch (error) {
    console.warn('error useRubricArticles', error)
  }
}

// get rubric lapsus
// export async function useRubricLapsus(params: string) {
//   const data = await $api(`${baseUrl}/articles/group?limit=5&${params}`)
//   return data
// }

// get subrubric latest
export async function useSubrubricLatest(slug: string = '', params: Record<string, any> = {}) {
  try {
    const { $api } = useNuxtApp()
    const defaultQuery = {
      'vip-indices': [1, 2],
      'limit': 5,
      'accesses': ['FREE', 'FREEMIUM'],
      'order_published_at': 'DESC',
    }
    const data = await $api(`${baseUrl}/articles/${slug}/sub-rubrics`, {
      query: { ...defaultQuery, ...params },
    })
    return data
  }
  catch (error) {
    console.warn('error useSubrubricLatest', error)
  }
}

export async function useTempoPlus(params: Record<string, any> = {}) {
  try {
    const { $api } = useNuxtApp()
    const defaultQuery = {
      order_published_at: 'DESC',
      access: 'VIP',
      page_size: 5,
    }
    const data = await $api<ApiResponse.Success<ArticleList[]>>(`${baseUrl}/articles`, {
      query: { ...defaultQuery, ...params },
    })
    return data
  }
  catch (error) {
    console.warn('error useTempoPlus', error)
    throw error
  }
}

// Get a particular user's list of articles
export async function useUserArticles(userId: string, params: Record<string, any> = {}) {
  const { $api } = useNuxtApp()
  const defaultQuery = {
    // 'order': 'DESC',
    // 'vip-indices': [0, 1, 2, 3, 4],
    // page_size: 5,
  }
  const data = await $api<ApiResponse.Success<ArticleUser[]>>(`${baseUrl}/article-users?user_id=${userId}&order_published_at=DESC`, {
    // const data = await $api<ApiResponse.Success<ArticleUser[]>>(`${baseUrl}/articles?user_id=${userId}&order_published_at=DESC`, {
    query: { ...defaultQuery, ...params },
  })
  return data
}

// Get Multimedia - Data articles
export async function useArticlesMediaData(pageSize: number = 21) {
  try {
    const { $api } = useNuxtApp()
    const url = `${baseUrl}/articles/article-data/multimedia?page_size=${pageSize}&page=1&rubric=data&order_published_at=desc`
    const response = await $api<ApiResponse.Success<ArticleList[]>>(url)
    if (response.data.length === 0) {
      response.data = []
    }
    return response
  }
  catch (error) {
    console.warn('error useArticlesMediaData', error)
  }
}

export async function useArticleByFormat(format: string, params: ArticleFormat = {
  page: 1,
  page_size: 10,
  order_published_at: 'DESC',
}) {
  try {
    const { $api } = useNuxtApp()
    const data = await $api<ApiResponse.Success<ArticleList[]>>(`${baseUrl}/articles/${format}/multimedia`, {
      query: { ...params },
    })
    return data
  }
  catch (error) {
    console.warn('error useArticleByFormat', error)
  }
}

// Call API function to get articles based on tags
export async function useArticlesByTags(tags: string[]) {
  const { $api } = useNuxtApp()
  const queryString = constructMultipleQueryString(tags, 'tags')
  const data = await $api<ApiResponse.Success<ArticleList[]>>(`${baseUrl}/articles?${queryString}`, {
    method: 'GET',
  })
  return data
}

export async function useArticleInteraktif() {
  const { $api } = useNuxtApp()
  const data = await $api<ApiResponse.Success<ArticleList[]>>(`${baseUrl}/articles/interaktif/rss`)
  return data
}

export async function useArticleGroupByIdentifier(article_id: string, fokus_category: string = '', limit: number = 5) {
  try {
    const { $api } = useNuxtApp()
    const url = `${baseUrl}/articles/${article_id}/groups/${fokus_category}/widget?limit=${limit}`
    const response = await $api<ApiResponse.Success<ArticleCategory>>(url)
    if (response.data.articles.length === 0) {
      response.data.articles = []
    }
    return response
  }
  catch (error) {
    console.warn('error useArticleGroupByIdentifier', error)
  }
}

export async function useArticleShortcutReader(
  identifier: string = 'bookmarks',
  params: Record<string, any> = {},
  method: 'GET' | 'POST' | 'DELETE' = 'GET',
) {
  try {
    const { $api } = useNuxtApp()
    // Remove any parameters with undefined or null values
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null)),
    ).toString()

    const requestOptions: RequestInit = {
      method,
      ...(method === 'POST' && { body: JSON.stringify(params) }),
    }

    const data = await $api<ApiResponse.Success<ArticleShortcut[]>>(
      `${baseUrl}/articles/shortcut/${identifier}?${queryParams}`,
      requestOptions,
    )

    return data
  }
  catch (error) {
    console.warn('error useArticleShortcutReader', error)
  }
}

export async function useHomepageSettings(
  nuxtApp: ReturnType<typeof useNuxtApp>,
  params: HomepageSettingParams = {
    platform: ['desktop'],
    page: 1,
    page_size: 10,
  },
) {
  const { $api } = useNuxtApp()
  const queryParams = new URLSearchParams()

  queryParams.append('page', params.page.toString())
  queryParams.append('page_size', params.page_size.toString())

  params.platform.forEach(platform => queryParams.append('platform[]', platform))
  if (params.typeArticle) {
    params.typeArticle.forEach(type => queryParams.append('type[]', type))
  }
  if (params.rubric) {
    queryParams.append('rubric_id', params.rubric)
  }

  const data = await $api<ApiResponse.Success<HomepageSettingResponse[]>>(
    `${baseUrl}/homepage-settings?${queryParams}`,
  )

  return data
}

export async function useArticleHeadline(
  params: HomepageSettingParams = {
    platform: ['desktop'],
    page: 1,
    page_size: 10,
  },
  rubric_slug: string = '',
) {
  const { $api } = useNuxtApp()
  const queryParams = new URLSearchParams()

  queryParams.append('page', params.page.toString())
  queryParams.append('page_size', params.page_size.toString())

  params.platform.forEach(platform => queryParams.append('platform[]', platform))

  const data = await $api<ApiResponse.Success<HomepageSettingResponse[]>>(
    `${baseUrl}/articles/${rubric_slug}/headline?${queryParams}`,
  )

  return data
}
