/* eslint-disable node/prefer-global/process */
export default defineNuxtPlugin((nuxtApp) => {
  // const config = useRuntimeConfig();
  const userAuth = useCookie('n_token')

  const $api = $fetch.create({
    // baseURL: config.apiGateway,
    // onRequest({ options, request }) {
    timeout: 20000,
    retry: 3,
    onRequest({ options }) {
      // Get the user agent from the request headers
      const userAgent = process.client
        ? navigator.userAgent
        : nuxtApp.ssrContext?.event.req.headers['user-agent'] || ''

      // Determine if the platform is mobile or desktop
      const isMobile = /Mobile|iP(?:hone|od|ad)|Android|BlackBerry|IEMobile|Silk/.test(userAgent)
      const platform = isMobile ? 'mobile-web' : 'desktop'

      options.headers = {
        ...Object.fromEntries(options.headers),
        'Authorization': `Bearer ${userAuth.value}`,
        'X-Platform-Application': platform, // Set the platform header
      }
    },
  })
  return {
    provide: {
      api: $api,
    },
  }
})
