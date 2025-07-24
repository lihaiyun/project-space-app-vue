<template>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
    <n-card style="max-width: 400px; width: 100%;" title="Login">
      <n-form
        @submit.prevent="onSubmit"
      >
        <n-form-item label="Email" :feedback="errors.email">
          <n-input
            v-model:value="email"
            v-bind="emailAttrs"
            :status="errors.email ? 'error' : undefined"
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </n-form-item>
        
        <n-form-item label="Password" :feedback="errors.password">
          <n-input
            v-model:value="password"
            v-bind="passwordAttrs"
            :status="errors.password ? 'error' : undefined"
            placeholder="Enter your password"
            type="password"
            show-password-on="click"
            :disabled="isLoading"
          />
        </n-form-item>
        
        <n-form-item>
          <n-button
            type="primary"
            attr-type="submit"
            :loading="isLoading"
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
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NButton, 
  NDivider, 
  NText,
  useMessage
} from 'naive-ui'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const message = useMessage()
const { login, isLoading } = useAuth()

const schema = yup.object({
  email: yup.string().required('Please enter your email').email('Please enter a valid email address').max(50, 'Email must be at most 50 characters'),
  password: yup.string().required('Please enter your password').min(8, 'Password must be at least 8 characters').max(50, 'Password must be at most 50 characters')
})

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values: any) => {
  try {
    // Use auth context login method
    await login({
      email: values.email,
      password: values.password
    })
    
    message.success('Login successful!')
    router.push('/')
  } catch (error: any) {
    console.error('Login error:', error)
    let errorMsg = error.response?.data?.message || 'Login failed. Please try again.'
    message.error(errorMsg)
  }
})
</script>

<style scoped>
</style>
