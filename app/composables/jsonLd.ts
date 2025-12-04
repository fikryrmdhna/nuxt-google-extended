import { computed } from 'vue'
import type { ArticleDetail } from '../types/article'
import { articleContentFormatter } from '../utils/text'
import { dateWithTimeZone } from '../utils/date'

export interface Breadcrumb {
  name: string
  url: string
}

function getTitleSeo(titlePrint: string, titleSeo: string) {
  return titleSeo?.trim() || titlePrint?.trim()
}

export function useJsonLd(article: ArticleDetail, breadcrumbs: Breadcrumb[], hasPaywall: boolean = false, config: ReturnType<typeof useRuntimeConfig>) {
  const jsonLd = computed(() => {
    const articleJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': getTitleSeo(article?.title_digital, article?.title_seo),
      'description': article?.description,
      'image': article?.feature_image,
      'datePublished': dateWithTimeZone(article?.published_at),
      'isAccessibleForFree': !hasPaywall,
      'articleBody': articleContentFormatter(article?.content, !hasPaywall),
      'caption': article?.summary.forEach(summary => summary),
      'author': article?.article_user?.map(user => ({
        '@type': 'Person',
        'name': user.user.name,
        'url': `${config.public.url}/penulis/${user.user.alias}-${user.user.id}`,
      })) || [],
      'publisher': {
        '@type': 'Organization',
        'name': 'PT Tempo Inti Media',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://tempo.co/logo.png',
        },
      },
      'isPartOf': {
        '@type': ['CreativeWork', 'Product'],
        'name': 'PT Tempo Inti Media',
        'productID': 'koran.tempo.co:showcase',
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://nuxt-google-extended.vercel.app/${article?.canonical_url}`,
      },
      'wordCount': article?.word_count,
    }

    if (hasPaywall) {
      articleJsonLd.hasPart = {
        '@type': 'WebPageElement',
        'isAccessibleForFree': false,
        'cssSelector': '.paywall-content',
      }
    }

    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': breadcrumb.name,
        'item': breadcrumb.url,
      })),
    }

    return [articleJsonLd, breadcrumbJsonLd]
  })

  return {
    jsonLd,
  }
}
