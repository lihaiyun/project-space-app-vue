<template>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
    <n-card style="max-width: 400px; width: 100%;" title="Register">
      <n-form
        @submit.prevent="onSubmit"
      >
        <n-form-item label="Name" :feedback="errors.name">
          <n-input
            v-model:value="name"
            v-bind="nameAttrs"
            :status="errors.name ? 'error' : undefined"
            placeholder="Enter your name"
            :disabled="isLoading"
          />
        </n-form-item>
        
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
        
        <n-form-item label="Confirm Password" :feedback="errors.confirmPassword">
          <n-input
            v-model:value="confirmPassword"
            v-bind="confirmPasswordAttrs"
            :status="errors.confirmPassword ? 'error' : undefined"
            placeholder="Confirm your password"
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
            Register
          </n-button>
        </n-form-item>
      </n-form>
      
      <n-divider />
      
      <div style="text-align: center;">
        <n-text>Already have an account? </n-text>
        <n-button text type="primary" @click="$router.push('/login')">
          Login here
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
const { register, isLoading } = useAuth()

const schema = yup.object({
  name: yup.string().trim()
    .required('Please enter your name')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .matches(/^[a-zA-Z '-,.]+$/, 'Name must only contain letters, spaces and characters: \'-,.'),
  email: yup.string().trim()
    .required('Please enter your email')
    .email('Please enter a valid email address')
    .max(50, 'Email must be at most 50 characters'),
  password: yup.string().trim()
    .required('Please enter your password')
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be at most 50 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, 'Password must contain at least one letter and one number'),
  confirmPassword: yup.string().trim()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const onSubmit = handleSubmit(async (values: any) => {
  try {
    // Use auth context register method
    await register({
      name: values.name,
      email: values.email,
      password: values.password
    })
    
    message.success('Registration successful! Please log in.')
    router.push('/login')
  } catch (error: any) {
    console.error('Registration error:', error)
    let errorMsg = error.response?.data?.message || 'Registration failed. Please try again.'
    message.error(errorMsg)
  }
})
</script>

<style scoped>
</style>
