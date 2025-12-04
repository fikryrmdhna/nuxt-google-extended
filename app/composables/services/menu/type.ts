export interface Menu {
  id: number
  product: string
  title: string
  title_en: string
  sequence: number
  is_active: boolean
  url: string
  icon_svg: string
  icon_png: string
  inactive_icon_svg: string
  inactive_icon_png: string
  is_active_badge: boolean
  platform: string[]
  ios_min_version: string
  android_min_version: string
  menu_type: string[]
  childs: null
  parent: null
}
