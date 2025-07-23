<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NGrid, NGridItem, NH1, NP, NTag, NSpace } from 'naive-ui'

const projects = ref([
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
])
</script>

<template>
  <div>
    <n-h1 style="text-align: center;">My Projects</n-h1>
    <n-grid x-gap="12" y-gap="12" cols="1 s:1 m:2 l:3" responsive="screen" class="mt-4">
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
