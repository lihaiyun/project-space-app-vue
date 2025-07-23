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
    const projectsArray = response.data.projects
    projects.value = projectsArray.map((item: any) => ({
      id: item.id,
      title: item.title || `Project ${item.id}`,
      description: (item.description || item.body || 'No description available').substring(0, 100) + '...',
      technologies: item.technologies || []
    }))
  } catch (err) {
    error.value = 'Failed to fetch projects'
    console.error('Error fetching projects:', err)
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
