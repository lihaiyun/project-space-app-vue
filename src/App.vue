<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NSpace, NButton, NIcon } from 'naive-ui'
import { Home, FolderOpen } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => router.push('/')
const goToProjects = () => router.push('/projects')
</script>

<template>
  <n-config-provider>
    <n-layout style="min-height: 100vh;">
      <n-layout-header style="height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; background: #001529;">
        <div style="color: white; font-size: 18px; font-weight: bold;">
          My Vue App
        </div>
        <n-space>
          <n-button 
            text 
            style="color: white;" 
            @click="goToHome"
            :class="{ active: $route.path === '/' }"
          >
            <template #icon>
              <n-icon><Home /></n-icon>
            </template>
            Home
          </n-button>
          <n-button 
            text 
            style="color: white;" 
            @click="goToProjects"
            :class="{ active: $route.path === '/projects' }"
          >
            <template #icon>
              <n-icon><FolderOpen /></n-icon>
            </template>
            Projects
          </n-button>
        </n-space>
      </n-layout-header>
      
      <n-layout-content style="padding: 24px;">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>
.active {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 4px;
}
</style>
