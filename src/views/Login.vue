<template>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
    <n-card style="max-width: 400px; width: 100%;" title="Login">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleLogin"
      >
        <n-form-item label="Email" path="email">
          <n-input
            v-model:value="formValue.email"
            placeholder="Enter your email"
            :disabled="loading"
          />
        </n-form-item>
        
        <n-form-item label="Password" path="password">
          <n-input
            v-model:value="formValue.password"
            placeholder="Enter your password"
            type="password"
            show-password-on="click"
            :disabled="loading"
          />
        </n-form-item>
        
        <n-form-item>
          <n-button
            type="primary"
            attr-type="submit"
            :loading="loading"
            style="width: 100%;"
          >
            Login
          </n-button>
        </n-form-item>
      </n-form>
      
      <n-divider />
      
      <div style="text-align: center;">
        <n-text>Don't have an account? </n-text>
        <n-button text type="primary" @click="$router.push('/register')">
          Register here
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NButton, 
  NDivider, 
  NText,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const formValue = reactive({
  email: '',
  password: ''
})

const rules: FormRules = {
  email: [
    {
      required: true,
      message: 'Please enter your email',
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: ['input', 'blur']
    }
  ]
}

const handleLogin = async (e: Event) => {
  e.preventDefault()
  
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // TODO: Implement actual login API call
    // Example:
    // const response = await authApi.login({
    //   email: formValue.email,
    //   password: formValue.password
    // })
    // 
    // Store auth token
    // localStorage.setItem('authToken', response.data.token)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('Login successful!')
    router.push('/')
    
  } catch (error) {
    console.error('Login error:', error)
    message.error('Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
