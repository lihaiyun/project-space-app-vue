import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

// Import Naive UI
import naive from 'naive-ui'

const app = createApp(App)
app.use(router)
app.use(naive)

// Initialize auth state before mounting
const { initAuth } = useAuth()
initAuth()

app.mount('#app')
