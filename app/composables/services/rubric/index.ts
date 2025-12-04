import type { IRubric, Rubric, SubRubric } from '../../../types/rubrics'
import type { ApiResponse } from '~/types/apiResponse'

const baseUrl = '/api/gateway'

// get rubrics
export async function useRubrics() {
  const { $api } = useNuxtApp()
  return await $api<ApiResponse.SuccessWithPagination<Rubric[]>>(`${baseUrl}/rubrics?page_size=50&domain_id=1`)
}

// get rubric detail using rubrik_slug
export async function useRubricSlug(rubrik_slug?: string) {
  const { data, status } = await useAPI<ApiResponse.SuccessWithPagination<Rubric>>(`${baseUrl}/rubric/${rubrik_slug}`)
  const pending = computed(() => status.value === 'pending')

  return {
    rubric: data,
    pending,
  }
}

// get list subrubrics
export async function useRubric(rubric_slug?: string) {
  try {
    const { $api } = useNuxtApp()
    return await $api<ApiResponse.SuccessWithPagination<IRubric>>(`${baseUrl}/rubric?slug=${rubric_slug}`)
  }
  catch (error) {
    console.warn('error useRubric', error)
  }
}

// get subrubric by slug
export async function useSubrubricBySlug(params: Record<string, any> = {}) {
  try {
    const { $api } = useNuxtApp()
    const data = await $api(`${baseUrl}/sub-rubric`, {
      query: { ...params },
    })
    return data
  }
  catch (error) {
    console.warn('error useSubrubricBySlug', error)
  }
}

// get subrubric id
export async function useSubrubricId(subrubric_id: string) {
  const { $api } = useNuxtApp()
  const data = await $api<ApiResponse.Success<SubRubric[]>>(`${baseUrl}/sub-rubrics/${subrubric_id}`)
  return data
}

// get subrubric
export async function useSubrubricSlug(subrubric_slug?: string) {
  const { $api } = useNuxtApp()
  const data = await $api<ApiResponse.SuccessWithPagination<SubRubric>>(`${baseUrl}/sub-rubrics/${subrubric_slug}`)
  return data
}

// get subrubric
export async function useSubrubricsByRubricID(rubrik_id?: string) {
  const { data, status } = await useAPI<ApiResponse.SuccessWithPagination<SubRubric[]>>(`${baseUrl}/sub-rubrics?rubric_id=${rubrik_id}`)
  const pending = computed(() => status.value === 'pending')

  return {
    subRubrics: data,
    pending,
  }
}

export async function useSingleSubrubricId(subrubric_id: string) {
  const { $api } = useNuxtApp()
  const data = await $api<ApiResponse.Success<SubRubric>>(`${baseUrl}/sub-rubrics/${subrubric_id}`)
  return data
}

export async function useSingleRubricId(subrubric_id: string) {
  const { $api } = useNuxtApp()
  const data = await $api<ApiResponse.Success<SubRubric>>(`${baseUrl}/rubric/${subrubric_id}`)
  return data
}
