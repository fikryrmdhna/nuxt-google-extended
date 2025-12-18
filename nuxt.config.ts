// https://nuxt.com/docs/api/configuration/nuxt-config
import * as process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  scripts: {},
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@pinia/nuxt'],
  runtimeConfig: {
    apiGateway: process.env.BASE_API_URL,
    cookieName: process.env.NUXT_COOKIE_NAME,
    headerType: process.env.NUXT_HEADER_TYPE,
    ssoGuestToken: process.env.NUXT_SSO_GUEST_TOKEN,
    ssoAppId: process.env.NUXT_SSO_APP_ID,

    singleBrandApiKey: process.env.NUXT_SINGLE_BRAND_API_KEY,

    public: {
      ssoURL: process.env.NUXT_SSO_URL,
      platform: process.env.NUXT_SSO_PLATFORM,
      token: process.env.NUXT_SSO_TOKEN,
      userEvent: process.env.NUXT_DATALAYER_EVENT_USER,
      environment: process.env.APP_ENV,
      url: process.env.APP_URL,
      seoGoogleBot: process.env.NUXT_SEO_GOOGLEBOT,
      seoGoogleBotNews: process.env.NUXT_SEO_GOOGLEBOTNEWS,
      seoYahooBot: process.env.NUXT_SEO_YAHOOBOT,
      seoRobots: process.env.NUXT_SEO_ROBOTS,
      allowRobots: process.env.NUXT_ALLOWROBOTS,
      allowAwatar: process.env.NUXT_ALLOWAWATAR,
      awatarCta: process.env.NUXT_AWATAR_CTA,
      scripts: {
        googleTagManager: {
          id: process.env.NUXT_PUBLIC_SCRIPTS_GOOGLE_TAG_MANAGER_ID,
        },
      },
      algolia: {
        appId: process.env.NUXT_ALGOLIA_APP_ID,
        searchApiKey: process.env.NUXT_ALGOLIA_SEARCH_API_KEY,
        searchArticlesIndex: process.env.NUXT_ALGOLIA_ARTICLES_INDEX,
        searchGroupsIndex: process.env.NUXT_ALGOLIA_GROUPS_INDEX,
      },
      chartbeatUID: process.env.CHARBEAT_UID,
      chartbeatDomain: process.env.CHARBEAT_DOMAIN,
      remp: {
        beamPropertiesToken: process.env.NUXT_BEAM_PROPERTIES_TOKEN,
        campaignURL: process.env.NUXT_CAMPAIGN_URL,
        beamURL: process.env.NUXT_BEAM_URL,
        beamTrackerURL: process.env.NUXT_BEAM_TRACKER_URL,
      },
      sentry: {
        dsn: process.env.SENTRY_DSN,
        sampleRate: process.env.SENTRY_SAMPLE_RATE,
        tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE,
      },
      articleFlag: {
        newHarianUi: process.env.NUXT_NEW_UI_HARIAN,
      },
      textToSpeech: {
        enabled: process.env.NUXT_TTS_ENABLED,
      },
    },
  },
  app: {
    cdnURL: process.env.NUXT_APP_CDN_URL,
    head: {
      title: 'Test',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Testing.' },
        { name: 'google-site-verification', content: 'jvSHStKnbDMnzMz6z0TJiG9UOuMM4LYbNBc9zGYhApQ' },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
      script: [
        // Google Extended Access scripts
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true,
        },
        {
          'src': 'https://news.google.com/swg/js/v1/swg.js',
          'async': true,
          'subscriptions-control': 'manual',
        },
      ],
      __dangerouslyDisableSanitizers: ['script'],
    },
  },
  vue: {
    propsDestructure: true,
  },
})