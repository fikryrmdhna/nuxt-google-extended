import type { ArticleGroup, ArticleGroupHarianResponse, ArticleGroupMingguan, Group, Groups } from '../article/type'
import type { ArticleCategory } from '~/components/article/type'
import type { ApiResponse } from '~/types/apiResponse'

const baseUrl = '/api/gateway'

// get group category focus
export async function useGroup(params: string, query?: string): Promise<ApiResponse.Success<Group>> {
  const { $api } = useNuxtApp()
  let url = `${baseUrl}/group?category=${params}&is_active=true&published_order=DESC&status=published`
  if (query) {
    url += `&${query}`
  }
  const data = await $api<ApiResponse.Success<Group>>(url)
  return data
}

export async function useGroups(category: string, params: string = ''): Promise<ApiResponse.Success<Groups>> {
  const { $api } = useNuxtApp()
  const data = await $api(`${baseUrl}/groups?category=${category}&is_active=true&status=published&${params}`)
  return data as ApiResponse.Success<Groups>
}

// get article group category
export async function useArticleGroup(params: string = '', query?: Record<string, string>): Promise<ApiResponse.Success<ArticleGroup[]>> {
  const { $api } = useNuxtApp()
  let url = `${baseUrl}/article-groups?group_id=${params}`
  const queryParams = {
    page_size: '50',
    sequence: 'ASC',
    ...query,
  }
  const queryString = new URLSearchParams(queryParams)
  if (!isEmpty(queryString?.toString())) {
    url += `&${queryString?.toString()}`
  }
  const data = await $api<ApiResponse.Success<ArticleGroup[]>>(url)
  return data
}

// get article group from lapsus
export async function useGroupLapsus(alias: string, params: string) {
  const { $api } = useNuxtApp()
  const data = await $api(`${baseUrl}/articles/group/${alias}?limit=5&${params}`)
  return data
}

export async function useArticleMingguan(page_size: number = 2, category: string = 'mingguan') {
  try {
    const { $api } = useNuxtApp()
    const url = `${baseUrl}/articles/groups/widget?category=${category}&page_size=${page_size}`
    const response = await $api<ApiResponse.Success<ArticleCategory>>(url)
    if (response.data.articles.length === 0) {
      response.data.articles = []
    }
    return response
  }
  catch (error) {
    console.warn('error useArticleMingguan', error)
  }
}

// get article group category mingguan
export async function useArticleGroupMingguan(id: string = ''): Promise<ApiResponse.Success<ArticleGroupMingguan>> {
  const { $api } = useNuxtApp()
  const url = `${baseUrl}/groups/${id}/articles`
  const data = await $api<ApiResponse.Success<ArticleGroupMingguan>>(url)
  return data
}

export async function useArticleGroupHarian(date: string = ''): Promise<ArticleGroupHarianResponse> {
  const { $api } = useNuxtApp()
  const url = `${baseUrl}/harian/${date}`
  const data = await $api<ArticleGroupHarianResponse>(url)
  return data
}

export async function useArticleVertical(params: string = '') {
  try {
    const { $api } = useNuxtApp()
    const data = await $api(`${baseUrl}/articles/jaringan-tempo?limit=1&media=${params}`)
    return data
  }
  catch (error) {
    console.warn('Error fetching articles:', error)
    return []
  }
}

// get tiers
export async function useTiers() {
  const { $api } = useNuxtApp()
  const data = await $api(`${baseUrl}/constant/access-article`)
  return data
}

// get category contents
export async function useCategoryContents() {
  const { $api } = useNuxtApp()
  const data = await $api(`${baseUrl}/constant/content-category`)
  return data
}
