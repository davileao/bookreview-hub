const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

interface GraphQLResponse<T = any> {
  data?: T
  errors?: Array<{ message: string }>
}

export async function graphqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    const result: GraphQLResponse<T> = await response.json()

    // Log for debugging
    console.log('GraphQL Response:', result)

    if (!response.ok) {
      console.error('HTTP Error:', response.status, response.statusText)
      console.error('Response body:', result)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors)
      throw new Error(result.errors[0]?.message || 'GraphQL error')
    }

    if (!result.data) {
      console.error('No data in response:', result)
      throw new Error('No data returned from GraphQL')
    }

    return result.data
  } catch (error) {
    console.error('GraphQL Request Error:', error)
    throw error
  }
}
