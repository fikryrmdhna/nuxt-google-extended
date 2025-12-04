export interface AlgoliaSearch {
  query: string
  page: number
  hitsPerPage: number
  filters: string
}

export interface AlgoliaHitArticle {
  article_id: number
  article_uuid: string
  article_id_old: number
  domain_id: number
  domain_id_old: number
  format_article_id: number
  sub_rubric_id: number
  access: string
  language: string
  title_digital: string
  content: string | undefined
  description: string
  word_count: number
  alphabet_count: number
  canonical_url: string
  canonical_url_old: string
  feature_image: string
  feature_image_caption: string
  fact_check_result: string
  headline_at: string
  breaking_news_at: string
  published_at: string
  approved_at: string
  created_at: string
  updated_at: string
  deleted_at: string
  is_active: boolean
  status: string
  unpublished_at: string
  tag_article: string[]
  users: UsersAlgolia[]
  objectID: string
  _highlightResult: HighlightResultAlgolia
}

export interface UsersAlgolia {
  user_id: number
  user_uuid: string
  nik?: string
  name: string
  foto?: string
  main_email?: string
  username: string
  actived_at: string
  created_at: string
  updated_at: string
  deleted_at: string
  status: string
}

export interface HighlightResultAlgolia {
  title_digital: {
    value: string
    matchLevel: string
    matchedWords: string[]
  }
  description: {
    value: string
    matchLevel: string
    fullyHighlighted: boolean
    matchedWords: string[]
  }
}

export interface AlgoliaHitGroup {
  group_id: number
  cover: string
  uuid: string
  name: string
  caption: string
  description: string
  category: string
  is_active: boolean
  published_at: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  objectID: string
}
