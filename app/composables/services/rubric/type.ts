import type { ArticleList } from '~/components/article/type'

export interface GroupedArticles {
  [rubricId: string]: {
    name: string
    articles: ArticleList[]
  }
}
