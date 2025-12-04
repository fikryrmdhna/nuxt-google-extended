import type { Menu } from './type'
import type { ApiResponse } from '~/types/apiResponse'

const baseUrl = '/api/gateway'

export async function useMenu(params: Record<string, any> = {}) {
  const { $api } = useNuxtApp()
  const data = await $api<ApiResponse.Success<Menu[]>>(`${baseUrl}/homepage-menu`, {
    query: { ...params },
  })
  return data
}

export async function useMenuSidebar(params: Record<string, any> = {}, slug: string = '') {
  const { $api } = useNuxtApp()
  const dataParentId: any = useState('menu-rubric-store-parent-id', () => null)

  const data = await $api<ApiResponse.Success<Menu[]>>(`${baseUrl}/homepage-menu`, {
    query: { ...params },
  })

  if (data && data.data.length) {
    const filteredRubrics: any = data?.data
      ?.slice(1)
      ?.filter((item: any) => item.menu_type && !item.menu_type.includes('jaringan-tempomedia'))
      ?.map((item: any) => ({
        id: item.id,
        text: item.title,
      }))

    if (filteredRubrics && filteredRubrics.length) {
      const parentId = filteredRubrics.find((c: any) => generateTransform(c.text) === generateTransform(slug))
      if (parentId && parentId.id) {
        dataParentId.value = parentId
      }
    }
  }

  return data
}
