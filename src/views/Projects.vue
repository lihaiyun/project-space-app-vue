<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NGrid, NGridItem, NH1, NP, NTag, NSpace, NSpin } from 'naive-ui'
import { projectsApi } from '../services/api'

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
}

const projects = ref<Project[]>([])
const loading = ref(false)
const error = ref('')

// Fetch projects from API
const fetchProjects = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Using the API service
    const response = await projectsApi.getProjects()
    
    // Transform API response to match our Project interface
    // Note: response is already the data due to our interceptor
    const apiData = Array.isArray(response) ? response : []
    projects.value = apiData.slice(0, 6).map((item: any, index: number) => ({
      id: item.id,
      title: item.title || `Project ${item.id}`,
      description: (item.body || 'No description available').substring(0, 100) + '...',
      technologies: [
        ['Vue 3', 'TypeScript', 'Vite'],
        ['Vue 3', 'Pinia', 'Socket.io'],
        ['Vue 3', 'Chart.js', 'Tailwind CSS'],
        ['React', 'Node.js', 'MongoDB'],
        ['Angular', 'Express', 'PostgreSQL'],
        ['Svelte', 'FastAPI', 'Redis']
      ][index % 6]
    }))
  } catch (err) {
    error.value = 'Failed to fetch projects'
    console.error('Error fetching projects:', err)
    
    // Fallback to static data if API fails
    projects.value = [
      {
        id: 1,
        title: 'Vue Portfolio Website',
        description: 'A personal portfolio website built with Vue 3 and TypeScript',
        technologies: ['Vue 3', 'TypeScript', 'Vite']
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates',
        technologies: ['Vue 3', 'Pinia', 'Socket.io']
      },
      {
        id: 3,
        title: 'E-commerce Dashboard',
        description: 'An admin dashboard for managing e-commerce operations',
        technologies: ['Vue 3', 'Chart.js', 'Tailwind CSS']
      }
    ]
  } finally {
    loading.value = false
  }
}

// Fetch projects when component mounts
onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div>
    <n-h1 style="text-align: center; margin-bottom: 2rem;">My Projects</n-h1>

    <!-- Loading state -->
    <div v-if="loading" style="text-align: center; padding: 2rem;">
      <n-spin size="large" />
      <p style="margin-top: 1rem;">Loading projects...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" style="text-align: center; padding: 2rem;">
      <n-card>
        <n-p style="color: red;">{{ error }}</n-p>
        <button @click="fetchProjects()" style="margin-top: 1rem;">Retry</button>
      </n-card>
    </div>

    <!-- Projects grid -->
    <n-grid v-else x-gap="12" y-gap="12" cols="1 s:1 m:2 l:3" responsive="screen">
      <n-grid-item v-for="project in projects" :key="project.id">
        <n-card :title="project.title" hoverable>
          <n-p>{{ project.description }}</n-p>
          <n-space>
            <n-tag v-for="tech in project.technologies" :key="tech" type="info">
              {{ tech }}
            </n-tag>
          </n-space>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
</style>
