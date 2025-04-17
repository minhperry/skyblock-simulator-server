export function getAPIKey() {
  return process.env['HYPIXEL_API_KEY']!
}

export async function fetchHypixelApi(url: string) {
  return fetch(url, {
    headers: {
      'API-Key': getAPIKey()
    }
  })
}