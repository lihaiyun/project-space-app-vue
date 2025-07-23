<script setup lang="ts">
import { NCard, NSpace, NText } from 'naive-ui'
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import HelloWorld from '../components/HelloWorld.vue'

const { user, isAuthenticated } = useAuth()
const welcomeMessage = computed(() => {
  return isAuthenticated.value ? `Welcome back, ${user.value?.name}!` : 'Welcome to My Vue App'
})
</script>

<template>
  <div style="text-align: center;">
    <n-space vertical size="large">
      <n-card :title="welcomeMessage">
          <div v-if="isAuthenticated" style="margin-bottom: 1rem;">
            <n-text>
              You are logged in as: <strong>{{ user?.email }}</strong>
            </n-text>
          </div>
          
          <div style="display: flex; justify-content: center; align-items: center; gap: 2rem;">
            <a href="https://vite.dev" target="_blank">
              <img src="/vite.svg" class="logo" alt="Vite logo" />
            </a>
            <a href="https://vuejs.org/" target="_blank">
              <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
            </a>
          </div>
      </n-card>
      
      <HelloWorld :msg="isAuthenticated ? `Hello ${user?.name}!` : 'Welcome to Home Page'" />
    </n-space>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
