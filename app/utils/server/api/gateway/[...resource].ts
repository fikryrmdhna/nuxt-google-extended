import { generateUnixTimestamp } from '~/utils/date'
import { generateSha256 } from '~/utils/general'

/**
 * Need to be updated as api requirements progresses
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const resource = event.context.params?.resource || null

  if (!resource)
    throw createError({ statusCode: 404, statusMessage: 'Resource not found' })

  const singleBrandApiKey = config.singleBrandApiKey
  const xRequestTime = generateUnixTimestamp()
  const xTempoToken = generateSha256(singleBrandApiKey + xRequestTime)

  event.node.req.headers['x-tempo-token'] = xTempoToken
  event.node.req.headers['x-api-key'] = singleBrandApiKey
  event.node.req.headers['x-request-time'] = xRequestTime.toString()

  const headers = getProxyRequestHeaders(event)
  const query = getQuery(event)

  const stringified = stringifyQuery(query)

  const withQuery = stringified ? `${resource}?${stringified}` : resource

  try {
    return proxyRequest(event, `${config.apiGateway}/single-brand/${withQuery}`, {
      headers,
    })
  }
  catch (error) {
    console.warn('error server api', error)
  }
})
