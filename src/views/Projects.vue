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
  <div class="projects-container">
    <n-h1>My Projects</n-h1>
    <n-grid :cols="1" :md-cols="2" :lg-cols="3" :gap="24">
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
.projects-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.project-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.project-card p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
