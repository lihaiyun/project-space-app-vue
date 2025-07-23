<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutContent, NMenu } from 'naive-ui'
import { Home, FolderOpen } from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'
import { computed, h } from 'vue'

const router = useRouter()
const route = useRoute()

const activeKey = computed(() => route.path)

const menuOptions = [
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

const handleMenuSelect = (key: string) => {
  router.push(key)
}
</script>

<template>
  <n-config-provider>
    <n-layout>
      <n-layout-header class="m-2">
        <div>
          <n-menu
            v-model:value="activeKey"
            mode="horizontal"
            :options="menuOptions"
            @update:value="handleMenuSelect"
            :root-props="{ style: 'background: transparent; border: none;' }"
            :item-props="{ style: 'color: white;' }"
          />
        </div>
      </n-layout-header>
      
      <n-layout-content style="padding: 24px;">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>
</style>
