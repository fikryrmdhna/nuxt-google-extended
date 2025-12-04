export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  return $fetch(`${config.public.ssoURL}/sso/sso/logout`)
})
