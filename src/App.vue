<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NMenu, NMessageProvider, NButton, NIcon, NDropdown } from 'naive-ui'
import { Home, FolderOpen, LogIn, PersonAdd, Person, LogOut } from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'
import { computed, h, watch } from 'vue'
import { useAuth } from './composables/useAuth'
import type { Component } from 'vue'

const router = useRouter()
const route = useRoute()
const { user, isAuthenticated, logout } = useAuth()

// Watch for authentication changes
watch(isAuthenticated, (newVal) => {
  console.log('Authentication changed:', newVal)
}, { immediate: true })

watch(user, (newVal) => {
  console.log('User changed:', newVal)
}, { immediate: true })

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

function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const userDropdownOptions = [
  {
    label: 'Logout',
    key: 'logout',
    icon: renderIcon(LogOut)
  }
]

const handleMenuSelect = (key: string) => {
  router.push(key)
}

const handleUserDropdown = async (key: string) => {
  if (key === 'logout') {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
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
              <!-- Show user menu when authenticated -->
              <div v-if="isAuthenticated" style="display: flex; align-items: center; gap: 1rem;">
                <n-dropdown :options="userDropdownOptions" @select="handleUserDropdown">
                  <n-button text style="border: none; box-shadow: none; outline: none;" :focusable="false">
                    <template #icon>
                      <Person />
                    </template>
                    {{ user?.name }}
                  </n-button>
                </n-dropdown>
              </div>
              
              <!-- Show auth menu when not authenticated -->
              <n-menu
                v-else
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
:deep(.n-button:focus),
:deep(.n-button:active),
:deep(.n-button:hover) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>
