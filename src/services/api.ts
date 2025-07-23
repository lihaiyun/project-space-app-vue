import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Enable cookies for CORS requests
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token or other headers if needed
    // config.headers.Authorization = `Bearer ${token}`
    console.log('Making request to:', config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// API methods
export const apiService = {
  // GET request
  get: (url: string, params?: any) => {
    return api.get(url, { params })
  },

  // POST request
  post: (url: string, data?: any) => {
    return api.post(url, data)
  },

  // PUT request
  put: (url: string, data?: any) => {
    return api.put(url, data)
  },

  // DELETE request
  delete: (url: string) => {
    return api.delete(url)
  }
}

// Specific API endpoints
export const projectsApi = {
  // Get all projects
  getProjects: () => apiService.get('/projects'), // Using jsonplaceholder as example
  
  // Get single project
  getProject: (id: number) => apiService.get(`/projects/${id}`),

  // Create project
  createProject: (project: any) => apiService.post('/projects', project),

  // Update project
  updateProject: (id: number, project: any) => apiService.put(`/projects/${id}`, project),

  // Delete project
  deleteProject: (id: number) => apiService.delete(`/projects/${id}`)
}

// Authentication API endpoints
export const authApi = {
  // User registration
  register: (userData: { name: string; email: string; password: string }) => 
    apiService.post('/users/register', userData),
  
  // User login
  login: (credentials: { email: string; password: string }) => 
    apiService.post('/users/login', credentials),

  // Get current user
  auth: () => apiService.get('/users/auth'),

  // User logout
  logout: () => apiService.post('/users/logout')
}

export default api
