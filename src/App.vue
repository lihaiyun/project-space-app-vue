<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NMenu, NMessageProvider, NButton, NText, NDropdown } from 'naive-ui'
import { Home, FolderOpen, LogIn, PersonAdd, Person, LogOut } from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'
import { computed, h } from 'vue'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const route = useRoute()
const { user, isAuthenticated, logout } = useAuth()

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

const userDropdownOptions = [
  {
    label: 'Profile',
    key: 'profile',
    icon: () => h(Person)
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: () => h(LogOut)
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
  } else if (key === 'profile') {
    // Handle profile navigation
    router.push('/profile')
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
                <n-text style="color: white;">Welcome, {{ user?.name }}!</n-text>
                <n-dropdown :options="userDropdownOptions" @select="handleUserDropdown">
                  <n-button text style="color: white;">
                    <template #icon>
                      <Person />
                    </template>
                    {{ user?.email }}
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
</style>
