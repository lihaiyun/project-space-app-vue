<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NButton, NH1, NP, NA } from 'naive-ui'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <n-card>
    <n-h1>{{ msg }}</n-h1>

    <div class="card">
      <n-button type="primary" @click="count++">
        Count is {{ count }}
      </n-button>
      <n-p>
        Edit <code>components/HelloWorld.vue</code> to test HMR
      </n-p>
    </div>

    <n-p>
      Check out
      <n-a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">
        create-vue
      </n-a>, the official Vue + Vite starter
    </n-p>
    <n-p>
      Learn more about IDE Support for Vue in the
      <n-a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">
        Vue Docs Scaling up Guide
      </n-a>.
    </n-p>
    <n-p class="read-the-docs">Click on the Vite and Vue logos to learn more</n-p>
  </n-card>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
