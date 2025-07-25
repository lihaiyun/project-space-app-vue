<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NGrid, NGridItem, NH2, NP, NTag, NSpin, NIcon, NImage, NButton } from 'naive-ui'
import { Person, Calendar, Create, Add } from '@vicons/ionicons5'
import { projectsApi } from '../../services/api'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { format } from 'date-fns'

const router = useRouter()
const { user } = useAuth()

interface Project {
  id: number
  name: string
  description: string
  dueDate: string
  status: "not-started" | "in-progress" | "completed"
  owner: {
    id?: number
    name: string
  }
  imageUrl: string
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
      name: item.name || `Project ${item.id}`,
      description: item.description || 'No description available',
      dueDate: item.dueDate || item.due_date || '',
      status: item.status || 'not-started',
      owner: {
        id: item.owner?.id || item.ownerId || null,
        name: item.owner?.name || item.owner || 'Unknown'
      },
      imageUrl: item.imageUrl || item.image_url || ''
    }))
  } catch (err) {
    error.value = 'Failed to fetch projects'
    console.error('Error fetching projects:', err)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'not-started':
      return 'default';
    case 'in-progress':
      return 'warning';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'not-started':
      return 'Not Started';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
}

const canEditProject = (project: Project) => {
  return user.value && project.owner.id && user.value.id === project.owner.id
}

const formatDueDate = (dueDate: string | number) => {
  if (!dueDate) return 'Not set'
  
  try {
    // Handle both timestamp (number) and date string
    const date = typeof dueDate === 'number' ? new Date(dueDate) : new Date(dueDate)
    return format(date, 'd MMM yyyy')
  } catch (error) {
    return 'Invalid date'
  }
}

// Fetch projects when component mounts
onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <n-h2 style="margin: 0;">Projects</n-h2>
      <n-button 
        v-if="user"
        type="primary"
        @click="router.push('/projects/add')"
      >
        <template #icon>
          <n-icon><Add /></n-icon>
        </template>
        Add Project
      </n-button>
    </div>

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
        <n-card hoverable>
          <template #cover v-if="project.imageUrl">
            <n-image 
              :src="project.imageUrl" 
              :alt="project.name"
              :preview-disabled="true"
              style="width: 100%; aspect-ratio: 16/9; object-fit: cover;"
            />
          </template>
          
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ project.name }}</span>
              <n-button 
                v-if="canEditProject(project)"
                type="primary" ghost
                @click="router.push(`/projects/${project.id}/edit`)"
                style="padding: 8px;"
              >
                <template #icon>
                  <n-icon size="18"><Create /></n-icon>
                </template>
                Edit
              </n-button>
            </div>
          </template>
          
          <div style="margin: 0.5rem 0;">
            <n-p style="display: flex; align-items: center; gap: 0.5rem;">
              <n-icon><Person /></n-icon>
              {{ project.owner.name }}
            </n-p>
            <n-p style="display: flex; align-items: center; justify-content: space-between;">
              <span style="display: flex; align-items: center; gap: 0.5rem;">
                <n-icon><Calendar /></n-icon>
                Due Date: {{ formatDueDate(project.dueDate) }}
              </span>
              <n-tag 
                :type="getStatusColor(project.status)" 
                :bordered="false"
              >
                {{ getStatusLabel(project.status) }}
              </n-tag>
            </n-p>
            <n-p>{{ project.description }}</n-p>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
::v-deep(.n-card-header) {
  padding-bottom: 0.5rem;
}

::v-deep(.n-p) {
  margin: 0.5rem 0;
}
</style>
