import 'server-only'

const API_URL = 'http://localhost:5000/api/post'

export class ApiRequestError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

async function getPostResource(
  path,
  authToken,
  { cache, failureMessage = 'Failed to fetch post data' } = {}
) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: {
      Cookie: `AuthToken=${authToken}`,
    },
    ...(cache ? { cache } : {}),
  })

  if (!response.ok) {
    throw new ApiRequestError(response.status, failureMessage)
  }

  return response.json()
}

export function getFeedPosts(authToken) {
  return getPostResource('/', authToken, { failureMessage: 'Failed to fetch posts' })
}

export function getPostById(authToken, postId) {
  return getPostResource(`/${postId}`, authToken, { cache: 'no-store' })
}

export function getPostReplies(authToken, postId) {
  return getPostResource(`/${postId}/reply`, authToken, {
    cache: 'no-store',
    failureMessage: 'Failed to retrieve replies',
  })
}
