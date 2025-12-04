import type { ArticleList } from '~/components/article/type'

export interface ArticleDetail {
  id: number
  article_uuid: string
  article_id_old: number
  domain_id: number
  domain_id_old: number
  format_article_id: number
  sub_rubric_id: number
  access: string
  content_category: string
  language: string
  tag_title: string
  // tag_article: string
  tag_article: {
    alias: string
    caption: string
  }[]
  title_digital: string
  title_seo: string
  title_print: string
  summary: any[]
  description: string
  content: string | undefined
  upperdeck: string
  kicker: string
  taicing: string
  is_byline: string
  is_label_tag: string
  snackbar: string
  word_count: number
  alphabet_count: number
  canonical_url: string
  canonical_url_old: string
  is_article_jembatan: string
  foot_note: string
  feature_image: string
  feature_image_caption: string
  fact_check_claim: string
  fact_check_result: string
  fact_check_result_image: string
  infografis_file: string
  embed_code: string
  headline_at: string
  is_audio_available: boolean
  is_anonymous_reporter_editor: boolean
  tts_audio_url?: string
  breaking_news_at: string
  published_at: string
  published_by: string
  approved_at: string
  approved_by: string
  paragraphs: string[]
  attachments: any
  article_user: ArticleUser[]
  sub_rubric: SubRubric
  article_groups: ArticleGroup[]
}

export interface ArticleDetailResponse {
  response_code: number
  status: string
  message: string
  pagination: Pagination
  data: ArticleDetail
}

export interface ArticleUser {
  id: number
  article_id: number
  user_id: number
  type: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: any
  deleted_by: string
  user: User
}

export interface User {
  id: number
  UUID: string
  user_remp_id: number
  is_editor: boolean
  is_contributor: boolean
  is_admin: boolean
  nik: string
  name: string
  alias: string
  foto: string
  biodata: string
  biodata_en: string
  main_email: string
  secondary_email: string
  username: string
  password: string
  force_reset_password: boolean
  facebook: string
  twitter: string
  linked: string
  actived_at: string
  actived_by: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: any
  deleted_by: string
}

export interface SubRubric {
  id: number
  name: string
  alias: string
  is_active: boolean
  rubric_id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: any
  deleted_by: string
  Articles: any
  Rubric: Rubric
}

export interface Rubric {
  id: number
  name: string
  alias: string
  is_active: boolean
  is_main: boolean
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: any
  deleted_by: string
  SubRubrics: any
}

export interface ArticleGroup {
  id: number
  sequence_article_group: number
  headline_at: any
  headline_by: string
  breaking_news_at: any
  breaking_news_by: string
  group_id: number
  article: ArticleList
  article_id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  group: Group
}

export interface Group {
  id: number
  uuid: string
  level: number
  cover: string
  caption: string
  category: string
  alias: string
  description: string
  meta_title: string
  meta_keyword: string
  sequence: number
  is_active: boolean
  published_at: string
  published_by: string
  parent_id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: any
  deleted_by: string
  Article: any
  article_count: number
}

export interface Groups {
  Date?: string
  groups: Group[]
  grouped?: Groups[]
  Groups?: Group[]
}

export interface ArticleFormat {
  page: number
  page_size: number
  rubric?: string
  order_published_at: string
}

export interface HomepageSettingParams {
  rubric?: string
  platform: string[]
  page: number
  page_size: number
  typeArticle?: string[]
}

export interface Pagination {
  total: number
  count: number
  per_page: number
  current_page: number
  next_page: string
  previous_page: string
  total_pages: number
}

export interface HomepageDataResponse {
  id: number
  rubric_id: number
  rubric_name: string
  type: string[]
  sequence: number
  platform: string[]
  created_at?: string
  created_by?: string
  updated_at?: string
  updated_by?: string
  deleted_at?: string | null
  deleted_by?: string
  article_id?: number
  article_title_digital?: string
  article_title_seo?: string
  article_description?: string
  article_access?: string
  article_feature_image?: string
  article_feature_image_caption?: string
  article_published_at?: string
  article_published_by?: string
  article_created_at?: string
  article_canonical_url?: string
  article_format_article_id?: number
  tag_id?: number
  tag_alias?: string
  tag_caption?: string
  tag_created_at?: string
  group_id?: number
  group_cover?: string
  group_caption?: string
  group_category?: string
}

export interface HomepageSettingResponse {
  response_code: number
  status: string
  message: string
  pagination?: Pagination
  data: HomepageDataResponse[]
}

export interface ArticleGroupMingguan {
  id: number
  uuid: string
  category: string
  level: number
  cover: string
  caption: string
  alias: string
  description: string
  meta_title: string
  meta_keyword: string
  sequence: number
  published_at: Date
  published_by: string
  parent_id: number
  is_active: boolean
  status: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  date: Date
  unpublished_at: string
  unpublished_by: string
  article_count: number
  articles: ArticleList[]
}

export interface ArticleGroupHarianResponse {
  response_code: number
  status: string
  message: string
  data: GroupData[]
  previous_groups: GroupNavigation
  next_groups: GroupNavigation
}

export interface GroupData {
  groups: ArticleGroupHarian[]
}

export interface ArticleGroupHarian {
  id: number
  uuid: string
  category: string
  cover: string
  caption: string
  alias: string
  description: string
  meta_title: string
  meta_keyword: string
  published_at: string
  articles: ArticleHarian[]
}

export interface ArticleHarian {
  access: string
  id: number
  title_digital: string
  canonical_url: string
  feature_image: string
  format_article_id: number
  sequence: number
  summary: any[]
  rubric: string
}

export interface GroupNavigation {
  title: string
  date: string
  url: string
}
