<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { ArticleCategory, ArticleList } from '../../types/article'
import type { ArticleUser } from '../../composables/services/article/type'
import { ARTICLE_TYPE } from '../../lib/constant'
import type { ApiResponse } from '~/types/apiResponse'

const url = useNuxtApp()
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const requestUrl = useRequestURL()
const article_slug = route?.params?.article_slug

console.log('article_slug: ', article_slug)

if (article_slug && !validateUri(article_slug as string)) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page Not Found: ${route.fullPath}`,
  })
}

const rubricSlug = ref((route.params.rubrik_slug ?? '') as string)
if (!rubricSlug.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page Not Found: ${route.fullPath}`,
  })
}

const articleSlug: string = (route.params.article_slug ?? '') as string
const queryArticleId = ((articleSlug as string)?.split('-').pop()) ?? ''

const dataSubRubric = ref()

// Widget Chatbot
const isAwatarAllowed = config.public.allowAwatar === 'true'

const navCekfakta = computed(() => rubricSlug.value === 'cekfakta')
// end: Widget Chatbot

const articleId = (article_slug as string)?.split('-')?.pop()
let isSubRubric = false
if (!articleId || Number.isNaN(Number(articleId))) {
  isSubRubric = true
}
let isAssistant = false
if (article_slug === 'tempo-assistant') {
  isAssistant = true
  throw createError({
    statusCode: 404,
    statusMessage: `Page Not Found: ${route.fullPath}`,
  })
}

// if rubric
if (isSubRubric && !isAssistant) {
  const { data: responseDataRubric, status: responseStatusRubric } = await useAsyncData(() => useRubric(rubricSlug.value))
  if (responseStatusRubric.value !== 'success' || !responseDataRubric.value?.data) {
    throw createError({
      statusCode: 404,
      statusMessage: `Page Not Found: ${route.fullPath}`,
    })
  }

  const { data: responseDataSubRubric, status: responseStatusSubRubric } = await useAsyncData(() => useSubrubricBySlug({
    slug: article_slug,
    is_active: true,
  }))
  if (responseStatusSubRubric.value !== 'success' || !responseDataSubRubric.value?.data) {
    throw createError({
      statusCode: 404,
      statusMessage: `Page Not Found: ${route.fullPath}`,
    })
  }
}

const dataArticleDetail = ref()
const dataArticleTrending = ref()
const dataEconBis = ref()
const dataNewArticles = ref()
const dataOthers = ref()
const dataSubrubrics = ref<any>([])
const listArticlesTagsOfDetail = ref<ArticleList[]>([])
const dataVideoArticle = ref()
const dataPhotoArticle = ref()
const isFokus = ref<boolean>(false)
const fokusCategory = ref<string | undefined>()
const fokusTitle = ref<string | undefined>()
const fokusArticle = ref<ApiResponse.Success<ArticleCategory> | undefined>()
const mingguanArticle = ref<ApiResponse.Success<ArticleCategory> | undefined>()
const isStatus = ref('')

// if detail article
if (!isSubRubric && !isAssistant) {
  if (!queryArticleId || !Number.isInteger(Number(queryArticleId))) {
    throw createError({
      statusCode: 404,
      statusMessage: `Page Not Found: ${route.fullPath}`,
    })
  }

  const { data: detail, status: statusDetail } = await useAsyncData(async () => useArticleId(articleId))
  isStatus.value = statusDetail.value

  const articleDetail = computed(() => {
    if (statusDetail.value === 'pending' || !detail.value) return null
    return detail.value
  })

  console.log('article detail data:', articleDetail.value)

  if (articleDetail.value && !articleDetail.value.data) {
    throw createError({
      statusCode: 404,
      statusMessage: `Page Not Found: ${route.fullPath}`,
    })
  }

  dataSubRubric.value = articleDetail.value?.data?.sub_rubric

  if (dataSubRubric.value && dataSubRubric.value?.Rubric) {
    rubricSlug.value = dataSubRubric.value?.Rubric.alias || dataSubRubric.value?.Rubric.name.toLowerCase() || rubricSlug.value
  }

  if (articleSlug && rubricSlug.value) {
    router.push({
      path: `/${articleDetail.value?.data?.canonical_url}`,
      query: route.query,
    })
  }

  const { data: articleTrendingData, status: articleTrendingStatus } = await useAsyncData(async () => useArticleTrending(rubricSlug.value, 'page_size=5'))

  const { data: econBisData, status: econBisStatus } = await useAsyncData(async () => useRubricArticles(rubricSlug.value, 'vip-indices=0&limit=4'))

  const { data: rubricData, status: _ } = await useAsyncData(async () => useRubric(rubricSlug.value))

  const { data: newArticlesData, status: newArticlesStatus } = await useAsyncData(async () => useRubricArticles(rubricSlug.value, 'vip-indices=1&limit=4&accesses=FREE&accesses=FREEMIUM'))

  const { data: othersData, status: othersStatus } = await useAsyncData(async () => useRubricArticles(rubricSlug.value, 'vip-indices=0&limit=5&accesses=FREE&accesses=FREEMIUM&order=DESC'))

  const popular = computed(() => {
    if (articleTrendingStatus.value === 'pending' || !articleTrendingData.value) return null
    return articleTrendingData.value
  })
  const econBis = computed(() => {
    if (econBisStatus.value === 'pending' || !econBisData.value) return null
    return econBisData.value
  })
  const newArticles = computed(() => {
    if (newArticlesStatus.value === 'pending' || !newArticlesData.value) return null
    return newArticlesData.value
  })
  const others = computed(() => {
    if (othersStatus.value === 'pending' || !othersData.value) return null
    return othersData.value
  })

  dataArticleDetail.value = articleDetail.value
  dataArticleTrending.value = popular.value
  dataEconBis.value = econBis.value
  dataNewArticles.value = newArticles.value
  dataOthers.value = others.value

  // Get instance store
  const articleStore = useArticleStore()

  // Save articleUuid to store if any
  onMounted(() => {
    if (dataArticleDetail.value?.data?.article_uuid) {
      articleStore.setArticleUuid(dataArticleDetail.value.data.article_uuid)
    }
  })

  // Reset articleUuid when component is unmounted
  onUnmounted(() => {
    articleStore.setArticleUuid(null)
  })

  // Ensure data.value exists and has at least 5 elements before accessing index 4
  if (rubricData.value && rubricData.value?.data?.sub_rubrics?.length >= 1) {
    const subrubricPromises = rubricData.value.data.sub_rubrics.map(async (subrubric: any) => {
      const { data, status } = await useAsyncData(
        `subrubric-${subrubric.alias}`,
        () => useSubrubricLatest(subrubric.alias, { 'vip-indices': [0], 'limit': 4 }),
      )
      if (status.value === 'success' && data.value?.data) {
        return {
          name: subrubric.alias,
          articles: data.value.data,
        }
      }
      return null
    })

    const resolvedSubrubrics = await Promise.all(subrubricPromises)
    dataSubrubrics.value = resolvedSubrubrics.filter((subrubric: any) => subrubric !== null)
  }
  else {
    console.warn('No valid subrubrics found or index 4 does not exist in data.value')
  }

  const { videoArticle, photoArticle } = await fetchRelatedArticles()
  dataVideoArticle.value = videoArticle
  dataPhotoArticle.value = photoArticle

  const fetchFallback = async (type: string, pageSize: number, targetRef: Ref) => {
    try {
      const { data: refetchPhotoVideo, status } = await useAsyncData(() =>
        useArticleByFormat(type, {
          page: 1,
          page_size: pageSize,
          order_published_at: 'DESC',
          rubric: dataSubRubric.value?.Rubric?.alias,
        }),
      )

      if (refetchPhotoVideo?.value?.data) {
        targetRef.value = computed(() =>
          status.value === 'pending' || !refetchPhotoVideo.value ? null : refetchPhotoVideo.value,
        ).value
      }
    }
    catch (error) {
      console.warn(`Error in watchEffect for ${type} ${route?.fullPath} - ${queryArticleId}`, error)
    }
  }

  // Fetch fallback data if video or photo articles are missing
  if (!dataVideoArticle.value?.data?.length) {
    await fetchFallback(ARTICLE_TYPE.VIDEO, 2, dataVideoArticle)
  }
  if (!dataPhotoArticle.value?.data?.length) {
    await fetchFallback(ARTICLE_TYPE.FOTO, 4, dataPhotoArticle)
  }

  async function fetchRelatedArticles() {
    if (!dataArticleDetail.value && !dataArticleDetail.value.data) {
      return { videoArticle: null, photoArticle: null }
    }

    const detailTags = dataArticleDetail.value?.data?.tag_article?.map((tag: any) => tag.alias) ?? []

    if (dataArticleDetail.value?.data?.format_article_id >= 2 && dataArticleDetail.value?.data?.format_article_id <= 7) {
      const href = formatHref()?.value(dataArticleDetail.value?.data?.canonical_url, dataArticleDetail.value?.data?.format_article_id)
      if (href) {
        router.push({
          path: `${href}`,
          query: route.query,
        })
      }
    }

    const videoArticle = ref(null)
    const photoArticle = ref(null)

    if (detailTags.length < 0) {
      console.warn('No tags found for filtering articles.')
      return { videoArticle: videoArticle.value, photoArticle: photoArticle.value }
    }

    try {
      const { data, status } = await useAsyncData(() => Promise.all([
        useArticlesByFilter({ tags: [detailTags[0]], format_article_id: '2', limit: 2 }) as unknown as ApiResponse.Success<ArticleList[]>,
        useArticlesByFilter({ tags: [detailTags[0]], format_article_id: '3', limit: 2 }) as unknown as ApiResponse.Success<ArticleList[]>,
      ]))

      const video = computed(() => {
        if (status.value === 'pending' || !data.value) return null
        return data.value[0]
      })

      const photo = computed(() => {
        if (status.value === 'pending' || !data.value) return null
        return data.value[1]
      })
      videoArticle.value = video.value
      photoArticle.value = photo.value
    }
    catch (error) {
      console.error('Error fetching related articles:', error)
    }

    return { videoArticle: videoArticle.value, photoArticle: photoArticle.value }
  }

  if (dataArticleDetail.value && dataArticleDetail.value?.data) {
    const tagAlias: string[] = dataArticleDetail.value.data?.tag_article[0]?.alias ? [dataArticleDetail.value.data?.tag_article[0]?.alias] : []
    const rubricSlug: string = dataSubRubric.value?.Rubric.alias || ''
    try {
      // First attempt with initial query params
      const { data, status } = await useAsyncData(() => useArticlesByFilter({
        ...(tagAlias.length > 0
          ? { tags: tagAlias }
          : { rubric_slug: rubricSlug }),
        format_article_id: '1',
        page_size: 6,
        accesses: ['FREE', 'VIP', 'FREEMIUM'],
        order_published_at: 'DESC',
      }))

      const articleByFilter = computed(() => {
        if (status.value === 'pending' || !data.value) return null
        return data.value
      })

      if (articleByFilter.value && articleByFilter.value?.data !== null) {
        listArticlesTagsOfDetail.value = articleId !== undefined ? articleByFilter.value?.data.filter((x: any) => x.id !== Number.parseInt(articleId)) : []
      }

      if (listArticlesTagsOfDetail.value.length === 0) {
        const { data, status } = await useAsyncData(() => useArticlesByFilter({
          rubric_slug: rubricSlug,
          format_article_id: '1',
          page_size: 6,
          accesses: ['FREE', 'VIP', 'FREEMIUM'],
          order_published_at: 'DESC',
        }))

        const articleByFilter = computed(() => {
          if (status.value === 'pending' || !data.value) return null
          return data.value
        })

        if (articleByFilter.value && articleByFilter.value?.data !== null) {
          listArticlesTagsOfDetail.value = articleId !== undefined ? articleByFilter.value?.data.filter((x: any) => x.id !== Number.parseInt(articleId)) : []
        }
      }
    }
    catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  function findFirstGroup(articleGroups: any[], category: string) {
    if (category === 'fokus') {
      return articleGroups.find(group => group.group.category === 'fokus')
    }
    else if (category === 'mingguan') {
      return articleGroups.find(group => group.group.category === 'mingguan')
    }
  }

  const fokusGroup = dataArticleDetail.value?.data?.article_groups
    ? findFirstGroup(dataArticleDetail.value?.data.article_groups, 'fokus')
    : null
  const mingguanGroup = dataArticleDetail.value?.data?.article_groups
    ? findFirstGroup(dataArticleDetail.value?.data.article_groups, 'mingguan')
    : null

  try {
    if (fokusGroup) {
      isFokus.value = true
      fokusCategory.value = fokusGroup?.group?.alias ?? ''
      fokusTitle.value = fokusGroup?.group?.caption ?? ''

      if (articleId && fokusCategory.value) {
        const { data, status } = await useAsyncData(() =>
          useArticleGroupByIdentifier(articleId, fokusCategory.value, 6))
        const fokus = computed(() => {
          if (status.value === 'pending' || !data.value) return undefined
          return data.value
        })
        fokusArticle.value = fokus.value
      }
      else {
        console.warn('Missing articleId or fokusCategory for fokus article lookup')
      }
    }
  }
  catch (error) {
    console.error('Error fetching fokus article:', error)
  }

  try {
    if (mingguanGroup) {
      const { data, status } = await useAsyncData(() => useArticleGroupByIdentifier(
        articleId ?? '',
        mingguanGroup?.group?.alias ?? '',
        6,
      ))

      const mingguan = computed(() => {
        if (status.value === 'pending' || !data.value) return undefined
        return data.value
      })

      mingguanArticle.value = mingguan.value
    }
    else {
      const { data, status } = await useAsyncData(() => useArticleMingguan(5))

      const mingguan = computed(() => {
        if (status.value === 'pending' || !data.value) return undefined
        return data.value
      })

      mingguanArticle.value = mingguan.value
    }
  }
  catch (error) {
    console.error('Error fetching mingguan article:', error)
  }

  const {
    title_seo = '',
    title_digital = '',
    canonical_url = '',
    format_article_id = 0,
    published_at = '',
    feature_image = '',
    description = '',
    sub_rubric = dataSubRubric.value,
    article_user = [],
    tag_article = [],
    title_print = '',
    access = '',
    content_category = '',
  } = dataArticleDetail.value?.data || {}

  if (dataArticleDetail.value && dataArticleDetail.value.data) {
    const titleUse = title_digital || title_seo
    const titleOgUse = title_digital || title_seo
    const formatHrefDetail = formatHref().value(canonical_url, format_article_id)
    const canonicalURL = `${url.$locationProtocol}//${url.$locationHostname}${url.$locationPort}${formatHrefDetail}`
    const publishedDate = `${onPublishedDate(published_at)} WIB`

    const headMeta = [
      {
        name: 'description',
        content: (description ?? '')
          .replace(/<([a-z]+)(?![^>]*\/>)[^>]*>/, '')
          .replace(/<\/([a-z]+)>$/, '')
          .replace('&nbsp;', ' ')
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, '')
          .replace(/<em>/g, '')
          .replace(/<\/em>/g, ''),
      },
      { name: 'googlebot', content: `${config.public.seoGoogleBot}` },
      { name: 'googlebot-news', content: `${config.public.seoGoogleBotNews}` },
      { name: 'yahoobot', content: `${config.public.seoYahooBot}` },
      { property: 'article:published_time', content: publishedDate },
      { property: 'fb:app_id', content: '332404380172618' },
      { property: 'fb:pages', content: '160355148441' },
      {
        property: 'og:description',
        content: (description ?? '')
          .replace(/<([a-z]+)(?![^>]*\/>)[^>]*>/, '')
          .replace(/<\/([a-z]+)>$/, '')
          .replace('&nbsp;', ' ')
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, '')
          .replace(/<em>/g, '')
          .replace(/<\/em>/g, ''),
      },
      { property: 'og:image', content: (feature_image || null) },
      { property: 'og:image:height', content: '405' },
      { property: 'og:image:width', content: '720' },
      { property: 'og:locale', content: 'id_ID' },
      { property: 'og:site_name', content: 'Tempo' },
      {
        property: 'og:title',
        content: titleOgUse,
      },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: canonicalURL },
      { property: 'twitter:card', content: 'summary_large_image' },
      {
        property: 'twitter:description',
        content: (description ?? '')
          .replace(/<([a-z]+)(?![^>]*\/>)[^>]*>/, '')
          .replace(/<\/([a-z]+)>$/, '')
          .replace('&nbsp;', ' ')
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, '')
          .replace(/<em>/g, '')
          .replace(/<\/em>/g, ''),
      },
      { property: 'twitter:image:src', content: (feature_image || null) },
      { property: 'twitter:site', content: '@tempodotco' },
      {
        property: 'twitter:title',
        content: titleOgUse,
      },
    ]

    const breadcrumbs: Breadcrumb[] = [
      { name: 'Home', url: 'https://tempo.co' },
      { name: `${dataSubRubric.value?.Rubric.name}`, url: `https://tempo.co/${rubricSlug.value ?? dataSubRubric.value?.alias}` },
      { name: `${dataSubRubric.value?.name}`, url: `https://tempo.co/${dataSubRubric.value?.Rubric.alias}/${dataSubRubric.value?.alias}` },
    ]

    const hasPaywall = dataArticleDetail.value?.data?.access === 'VIP'
    const { jsonLd } = useJsonLd(dataArticleDetail?.value?.data, breadcrumbs, hasPaywall, config)

    const ratingValue = computed(() => {
      const factCheckResult = dataArticleDetail.value?.data?.fact_check_result
      const ratingsMap = {
        'benar': '5',
        'sebagian benar': '4',
        'belum ada bukti': '3',
        'sesat': '2',
      } as const

      return factCheckResult in ratingsMap
        ? ratingsMap[factCheckResult as keyof typeof ratingsMap]
        : '1'
    })

    const claimReviewScript = navCekfakta.value
      ? [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ClaimReview',
              'url': `${canonicalURL}`,
              'claimReviewed': `${title_digital}`,
              'itemReviewed': {
                '@type': 'Claim',
                'author': {
                  '@type': 'Organization',
                  'name': 'Tempo.co',
                  'sameAs': 'https://www.tempo.co/cekfakta',
                },
                'datePublished': `${toFullStringDate(published_at)}`,
                'appearance': {
                  '@type': 'OpinionNewsArticle',
                  'url': `${canonicalURL}`,
                  'headline': `${title_digital}`,
                  'datePublished': `${toFullStringDate(published_at)}`,
                  'author': {
                    '@type': 'Person',
                    'name': `${article_user?.find((user: ArticleUser) => user.type === 'editor')?.user.name}`,
                  },
                  'image': `${feature_image}`,
                  'publisher': {
                    '@type': 'Organization',
                    'name': 'Tempo.co',
                    'logo': {
                      '@type': 'ImageObject',
                      'url': '/img/logo-tempo.svg',
                    },
                  },
                },
              },
              'author': {
                '@type': 'Organization',
                'name': 'Tempo.co Cekfakta',
              },
              'reviewRating': {
                '@type': 'Rating',
                'ratingValue': `${ratingValue.value}`,
                'bestRating': '5',
                'worstRating': '1',
                'alternateName': `${dataArticleDetail.value?.data?.fact_check_result}`,
              },
            }),
          },
        ]
      : []

    useHead({
      script: [
        ...jsonLd.value.map(ld => ({
          type: 'application/ld+json',
          children: JSON.stringify(ld),
        })),
        {
          innerHTML: `
            dataLayer = [{
              rubric: '${rubricSlug.value || ''}',
              sub_rubric: '${sub_rubric?.alias || ''}',
              published_date: '${toFullStringDate(published_at)}',
              reporter: '${article_user.find((user: ArticleUser) => user.type === 'reporter')?.user.name}',
              editor: '${article_user?.find((user: ArticleUser) => user.type === 'editor')?.user.name}',
              tags: ${JSON.stringify((tag_article ?? []).map((tag: { alias: string, caption: string }) => tag.alias))},
              article_id: ${articleId},
              title_digital: '${title_digital}',
              title_seo: '${title_seo || title_digital}',
              title_print: '${title_print || title_digital}',
              access: '${access}',
              content_category: '${content_category}',
            }]
          `,
        },
        ...claimReviewScript,
      ],
      meta: headMeta,
    })

    // useServerSeoMeta({
    //   title: titleUse,
    //   ogTitle: titleOgUse,
    //   description: (description ?? '')
    //     .replace(/<([a-z]+)(?![^>]*\/>)[^>]*>/, '')
    //     .replace(/<\/([a-z]+)>$/, '')
    //     .replace('&nbsp;', ' ')
    //     .replace(/<p>/g, '')
    //     .replace(/<\/p>/g, '')
    //     .replace(/<em>/g, '')
    //     .replace(/<\/em>/g, ''),
    //   ogImage: feature_image || null,
    //   ogUrl: canonicalURL,
    //   ogType: 'article',
    // })

    // const pushedToDataLayer = ref(false)
    // watch(
    //   () => userLoggedIn.status.value,
    //   (status: any) => {
    //     if (status !== 'loading' && !pushedToDataLayer.value) {
    //       pushToDataLayer({
    //         rubric: rubricSlug.value || '',
    //         sub_rubric: sub_rubric?.alias || '',
    //         published_date: published_at ? toFullStringDate(published_at) : published_at,
    //         reporter: article_user.find((user: ArticleUser) => user.type === 'reporter')?.user.name,
    //         editor: article_user?.find((user: ArticleUser) => user.type === 'editor')?.user.name,
    //         tags: (tag_article ?? []).map((tag: {
    //           alias: string
    //           caption: string
    //         }) => tag.alias),
    //         article_id: articleId,
    //         title_digital,
    //         title_seo: title_seo || title_digital,
    //         title_print: title_print || title_digital,
    //         access,
    //         content_category,
    //       }, config, userLoggedIn)
    //       pushedToDataLayer.value = true
    //     }
    //   },
    //   { immediate: true },
    // )
  }

  // const { data: checkIpAddr } = await useFetch('/api/ipaddr')

  // function trackRemp() {
  //   const articlesDataBeam = dataArticleDetail.value?.data
  //   const getRubricBeam = articlesDataBeam?.sub_rubric?.Rubric?.name
  //   const getSubRubricBeam = articlesDataBeam?.sub_rubric?.name
  //   const ipaddr = checkIpAddr.value?.ip ?? ''
  //   const user = userLoggedIn.data?.value
  //   const user_ids = user?.id ?? ''
  //   const userIdBeam = user_ids !== undefined && user_ids !== null ? String(user_ids) : ''
  //   const subscribe_status = user?.nonvip_subscription ?? false

  //   useRempTracker({ ipaddr, userIdBeam, subscribe_status, rubricBeam: getRubricBeam, subRubricBeam: getSubRubricBeam, articlesDataBeam, articleId, requestUrl, route, config })
  // }

  // watch(
  //   () => userLoggedIn.status.value,
  //   (status: any) => {
  //     if (status !== 'loading') {
  //       trackRemp()
  //     }
  //   },
  //   { immediate: true },
  // )
}
// end detail article

definePageMeta({
  path: '/:rubrik_slug/:article_slug',
  static: true,
})
</script>

<template>
  <div>
    <h1>Google Extended Playground</h1>
    <h1
      v-if="isSubRubric && !isAssistant && isAwatarAllowed && isAssistant"
    >
      Not Article Detail
    </h1>
    <article-detail
      v-else
      :article="dataArticleDetail"
    />
  </div>
</template>
