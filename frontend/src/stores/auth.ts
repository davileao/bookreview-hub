import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { graphqlRequest } from '@/utils/graphql'

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`

const REGISTER_MUTATION = `
  mutation Register($email: String!, $name: String!, $password: String!) {
    register(email: $email, name: $name, password: $password) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`

const ME_QUERY = `
  query Me {
    me {
      id
      email
      name
      role
    }
  }
`

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await graphqlRequest(LOGIN_MUTATION, { email, password })

      if (result.login) {
        token.value = result.login.token
        user.value = result.login.user
        localStorage.setItem('token', result.login.token)
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, name: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await graphqlRequest(REGISTER_MUTATION, { email, name, password })

      if (result.register) {
        token.value = result.register.token
        user.value = result.register.user
        localStorage.setItem('token', result.register.token)
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao registrar'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const checkAuth = async () => {
    if (token.value) {
      try {
        const result = await graphqlRequest(ME_QUERY)

        if (result.me) {
          user.value = result.me
        } else {
          logout()
        }
      } catch (err) {
        logout()
      }
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
  }
})
