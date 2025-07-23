<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NMenu, NMessageProvider } from 'naive-ui'
import { Home, FolderOpen, LogIn, PersonAdd } from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'
import { computed, h } from 'vue'

const router = useRouter()
const route = useRoute()

const activeKey = computed(() => route.path)

const mainMenuOptions = [
  {
    label: 'Home',
    key: '/',
    icon: () => h(Home)
  },
  {
    label: 'Projects',
    key: '/projects',
    icon: () => h(FolderOpen)
  }
]

const authMenuOptions = [
  {
    label: 'Login',
    key: '/login',
    icon: () => h(LogIn)
  },
  {
    label: 'Register',
    key: '/register',
    icon: () => h(PersonAdd)
  }
]

const handleMenuSelect = (key: string) => {
  router.push(key)
}
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <n-layout>
        <n-layout-header style="padding: 1rem 2rem 0 2rem">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div>
              <n-menu
                v-model:value="activeKey"
                mode="horizontal"
                :options="mainMenuOptions"
                @update:value="handleMenuSelect"
                :root-props="{ style: 'background: transparent; border: none;' }"
                :item-props="{ style: 'color: white;' }"
              />
            </div>
            <div style="margin-left: auto;">
              <n-menu
                v-model:value="activeKey"
                mode="horizontal"
                :options="authMenuOptions"
                @update:value="handleMenuSelect"
                :root-props="{ style: 'background: transparent; border: none;' }"
                :item-props="{ style: 'color: white;' }"
              />
            </div>
          </div>
        </n-layout-header>
        
        <n-layout-content style="padding: 1rem 2rem">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
