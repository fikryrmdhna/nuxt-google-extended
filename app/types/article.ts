import type { SubRubric } from '../rubric/types'
import type { ArticleGroup } from '~/composables/services/article/type'

interface IRubric {
  id: number
  name: string
  alias: string
  is_active: boolean
  is_main: false
  created_at: Date | string
  created_by: Date | string
  updated_at: Date | string
  updated_by: string
  deleted_at: Date | string | null
  deleted_by: Date | string
  SubRubrics: Record<any, any> | null
}
export interface ISubrubric {
  id: number
  name: string
  alias: string
  is_active: boolean
  rubric_id: number
  created_at: Date | string
  created_by: Date | string
  updated_at: Date | string
  updated_by: string
  deleted_at: Date | string | null
  deleted_by: Date | string
  articles: ArticleList[]
  rubric: IRubric
}
export interface ArticleUser {
  id: number
  article_id: number
  user_id: number
  type: string
  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at?: Date | null
  deleted_by: string
  user: User
}

export interface ArticleShortcut {
  id: number
  article_id: number
  remp_user_id: number
  type: string
  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at?: Date | null
  deleted_by: string
  article: ArticleList
}

export interface ArticleList {
  id: number
  article?: ArticlePenulis
  article_uuid: string
  article_id_old: number
  domain_id: number
  domain_id_old: number
  format_article_id: number
  sub_rubric_id: number
  access: 'VIP' | 'FREE' | 'FREEMIUM' | 'VIP_UNLOCKED'
  language: string
  tag_title: string
  tag_article: string
  title_print: string
  title_digital: string
  title_seo: string
  summary: string
  description: string
  content: string | undefined
  upperdeck: string
  kicker: string
  taicing: string
  is_byline: string
  is_label_tag: string
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
  infografis_file: string
  embed_code: string
  headline_at: string
  breaking_news_at: string
  attachments: Attachment[]
  sub_rubric: ISubrubric
  published_at: string
  article_user: ArticleUser[]
  content_category: string
  created_by: string
  is_anonymous_reporter_editor?: boolean
}

export interface ArticleListResponse {
  response_code: number
  status: string
  message: string
  data: ArticleList[]
}

export interface ArticleCategory {
  id: number
  group_name: string
  group_cover: string
  published_at: string
  articles: ArticleList[]
}

export interface ArticleCategoryResponse {
  response_code: number
  status: string
  message: string
  data: ArticleCategory
}

export interface Attachment {
  id: number
  UUID: string
  title: string
  description: string
  name: string
  link: string
  is_video: boolean
  video_source: string
  video_target: string
  editor: string
  published_at: Date
  published_by: string
  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at?: Date | null
  deleted_by: string
}

/** Possible Duplicate: /composables/services/article */
// export interface ArticleGroup {
//   id: number
//   uuid: string
//   category: string
//   level: number
//   cover: string
//   caption: string
//   alias: string
//   description: string
//   meta_title: string
//   meta_keyword: string
//   sequence: number
//   published_at: Date
//   published_by: string
//   parent_id: number
//   created_at: Date
//   created_by: string
//   updated_at: string
//   updated_by: string
//   articles: null
// }

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
  active_at?: Date | null
  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at?: Date | null
  deleted_by: string
}
export interface ArticleUser {
  id: number
  article_id: number
  user_id: number
  type: string
  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at?: Date | null
  deleted_by: string
  user: User
}

export interface ArticleDetail {
  id: number
  article_uuid: string
  article_id_old: number
  domain_id: number
  domain_id_old: number
  format_article_id: number
  sub_rubric_id: number
  access: string
  language: string
  tag_title: string
  tag_article: {
    alias: string
    caption: string
  }[]
  title_digital: string
  title_seo: string
  title_print: string
  summary: string
  description: string
  content: string | undefined
  upperdeck: string
  kicker: string
  snackbar: string
  taicing: string
  is_byline: string
  is_label_tag: string
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
  breaking_news_at: string
  published_at: string
  published_by: string
  approved_at: string
  is_audio_available: boolean
  tts_audio_url: string
  paragraphs: string[]
  attachments: Attachment[]
  sub_rubric: SubRubric
  article_user: ArticleUser[]
  article_groups: ArticleGroup[]
}

export interface ArticleDetailResponse {
  response_code: number
  status: string
  message: string
  data: ArticleDetail
}

export interface ArticlePenulis {
  access: string
  article_uuid: string
  canonical_url: string
  feature_image: string
  format_article_id: string
  id: string
  published_at: string
  status: string
  sub_rubric_id: string
  summary: string
  title_digital: string
  title_print: string
  title_seo: string
}
