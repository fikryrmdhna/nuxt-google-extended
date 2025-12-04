export default defineEventHandler((event) => {
  const req = event.node.req

  // Get the IP address from the request
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null

  return {
    ip,
  }
})
