import type { ISubrubric } from '~/components/article/type'

export interface Rubric {
  id: number
  name: string
  alias: string
  url: string
  is_active: boolean
  is_main: boolean
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  is_active_badge: boolean
}

export interface SubRubric {
  id: number
  name: string
  alias: string
  is_active: boolean
  is_main: boolean
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  rubric_id: number
}

export interface IRubric {
  id: number
  name: string
  alias: string
  is_active: boolean
  is_main: boolean
  created_at: Date | string
  created_by: Date | string
  updated_at: Date | string
  updated_by: string
  sub_rubrics: ISubrubric[]
}
