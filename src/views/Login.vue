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
import * as yup from 'yup'
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
import { authApi } from '../services/api'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const formValue = reactive({
  email: '',
  password: ''
})

// Yup validation schema
const validationSchema = yup.object({
  email: yup
    .string()
    .required('Please enter your email')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(6, 'Password must be at least 6 characters')
})

// Convert Yup schema to Naive UI rules
const rules: FormRules = {
  email: [
    {
      required: true,
      validator: async (_rule, value) => {
        try {
          await validationSchema.validateAt('email', { email: value })
        } catch (error: any) {
          throw new Error(error.message)
        }
      },
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      validator: async (_rule, value) => {
        try {
          await validationSchema.validateAt('password', { password: value })
        } catch (error: any) {
          throw new Error(error.message)
        }
      },
      trigger: ['input', 'blur']
    }
  ]
}

const handleLogin = async (e: Event) => {
  e.preventDefault()
  
  if (!formRef.value) return
  
  try {
    // First validate the form - this will prevent submission if validation fails
    await formRef.value.validate()
    
    loading.value = true
    
    // Make API call (Yup validation is already handled by the form rules)
    const response = await authApi.login({
      email: formValue.email,
      password: formValue.password
    })
    
    // Store auth token
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    
    message.success('Login successful!')
    router.push('/')
    
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Check if it's a form validation error (array of validation errors)
    if (Array.isArray(error) && error.length > 0) {
      // Form validation failed - don't show message as form will show inline errors
      return
    }
    
    // Only handle API errors here, validation errors are handled by the form
    if (error.response?.status === 401) {
      message.error('Invalid email or password')
    } else if (error.response?.status === 422) {
      message.error('Please check your input and try again')
    } else if (!error.response) {
      // This means it's likely a validation error from the form
      message.error('Please check your input fields')
    } else {
      message.error('Login failed. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
