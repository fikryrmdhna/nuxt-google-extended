import { defineSitemapEventHandler } from '#imports'

interface Article {
  canonical_url: string
  updated_at: string
}

interface BaseResponse {
  data: Article[]
}

export default defineSitemapEventHandler(async (event) => {
  const { category } = event.context.params as { category: string }

  const articles = await $fetch<BaseResponse>(
    `/api/gateway/articles?order_updated_at=DESC&page_size=200&rubric_slug=${category}`,
  )

  const mapped = articles.data.map((p: Article) => {
    return { loc: p.canonical_url, lastmod: new Date(p.updated_at) }
  })

  return mapped
})
