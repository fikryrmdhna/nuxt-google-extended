import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // const authHeaderValue = getRequestHeader(event, 'authorization')
  const authHeaderValue = getCookie(event, 'n_token')

  if (!authHeaderValue) {
    return null
  }

  if (typeof authHeaderValue === 'undefined')
    throw createError({ statusCode: 403, statusMessage: 'Need to pass valid Bearer-authorization header to access this endpoint' })

  const res = await $fetch<{ status: string, user: any }>(`${config.public.ssoURL}/api/v2/users/info`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authHeaderValue}`,
      'Token-Guest-Tempo': config.ssoGuestToken,
      'App-Tempo-Id': config.ssoAppId,
      'X-Platform-Application': config.public.platform,
      'X-Platform-Token': config.public.token,
    },
  }).catch(() => { throw createError({ statusCode: 401, statusMessage: 'Error fetching session user' }) })

  const initial = getInitial(res.user)
  const fullname = getFullname(res.user)

  return { ...res.user, initial, fullname }
})
