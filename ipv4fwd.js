const MAILGUN_API_HOST = "https://api.mailgun.net"

export default {
  async fetch(request, env) {
    const secret = request.headers.get("X-Relay-Secret")
    if (!env.RELAY_SECRET || secret !== env.RELAY_SECRET) {
      return new Response("Forbidden", { status: 403 })
    }

    const url = new URL(request.url)
    const target = MAILGUN_API_HOST + url.pathname + url.search

    const headers = new Headers(request.headers)
    headers.delete("x-relay-secret")
    headers.delete("host")

    const response = await fetch(target, {
      method: request.method,
      headers,
      body: request.body,
      duplex: "half",
    })

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    })
  },
}
