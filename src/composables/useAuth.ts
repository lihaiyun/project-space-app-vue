import { computed, reactive } from 'vue'
import { authApi } from '../services/api'

// User interface
export interface User {
  id: number
  name: string
  email: string
}

// Auth state
const authState = reactive({
  user: null as User | null,
  isLoading: false,
  isAuthenticated: false
})

// Auth composable
export const useAuth = () => {
  // Getters
  const user = computed(() => authState.user)
  const isLoading = computed(() => authState.isLoading)
  const isAuthenticated = computed(() => authState.isAuthenticated)

  // Actions
  const setUser = (userData: User) => {
    authState.user = userData
    authState.isAuthenticated = true
  }

  const clearUser = () => {
    authState.user = null
    authState.isAuthenticated = false
  }

  const setLoading = (loading: boolean) => {
    authState.isLoading = loading
  }

  // Login user
  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true)
      const response = await authApi.login(credentials)
      
      console.log('Login response:', response.data) // Debug log
      
      // Handle different possible response structures
      let userData = null
      if (response.data.user) {
        userData = response.data.user
      } else if (response.data.id) {
        userData = response.data
      }
      
      if (userData) {
        setUser({
          id: userData.id || 1, // Fallback ID
          name: userData.name || userData.username || 'User',
          email: userData.email || credentials.email
        })
        console.log('User set:', authState.user) // Debug log
      } else {
        // If no user data returned, still set as authenticated with minimal info
        setUser({
          id: 1,
          name: 'User',
          email: credentials.email
        })
      }
      
      return response
    } catch (error) {
      clearUser()
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register user
  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      setLoading(true)
      const response = await authApi.register(userData)
      return response
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = async () => {
    try {
      setLoading(true)
      await authApi.logout()
      clearUser()
    } catch (error) {
      // Clear user even if logout API fails
      clearUser()
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get current user (from API)
  const getCurrentUser = async () => {
    try {
      setLoading(true)
      const response = await authApi.auth()
      
      if (response.data) {
        setUser(response.data.user)
      }
      
      return response.data
    } catch (error) {
      clearUser()
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Initialize auth (check if user is already logged in)
  const initAuth = async () => {
    try {
      await getCurrentUser()
    } catch (error) {
      // If auth check fails, user is not authenticated
      clearUser()
    }
  }

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    
    // Actions
    initAuth,
    register,
    login,
    logout
  }
}
