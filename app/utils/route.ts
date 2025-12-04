import { computed } from 'vue'
import { ARTICLE_TYPE_NUMBER } from '~/lib/constant'

export function formatHref() {
  return computed(() => {
    return function (href: string, formatId: number) {
      if (!href.startsWith('/') && !href.startsWith('https://') && !href.startsWith('http://')) {
        return redirectArticleFormatDetail(href, formatId)
      }
      return href
    }
  })
}

export function redirectArticleFormatDetail(href: string, formatId: number): string {
  if (formatId < 2 || formatId > 7 || formatId === 6) return `/${href}`

  const articleTypeNumberKeys = Object.keys(ARTICLE_TYPE_NUMBER) as (keyof typeof ARTICLE_TYPE_NUMBER)[]
  const formatType = articleTypeNumberKeys.find(key => ARTICLE_TYPE_NUMBER[key] === formatId)

  if (!formatType) return `/${href}`

  return `/${formatType}/${href}`
}
