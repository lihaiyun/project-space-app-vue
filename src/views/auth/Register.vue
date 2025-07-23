<template>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
    <n-card style="max-width: 400px; width: 100%;" title="Register">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleRegister"
      >
        <n-form-item label="Name" path="name">
          <n-input
            v-model:value="formValue.name"
            placeholder="Enter your name"
            :disabled="loading"
          />
        </n-form-item>
        
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
        
        <n-form-item label="Confirm Password" path="confirmPassword">
          <n-input
            v-model:value="formValue.confirmPassword"
            placeholder="Confirm your password"
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
import { authApi } from '../../services/api'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const formValue = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Yup validation schema
const validationSchema = yup.object({
  name: yup
    .string().trim()
    .required('Please enter your name')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .matches(/^[a-zA-Z '-,.]+$/, 'Name must only contain letters, spaces and characters: \'-,.'),
  email: yup
    .string().trim()
    .required('Please enter your email')
    .email('Please enter a valid email address')
    .max(50, 'Email must be at most 50 characters'),
  password: yup
    .string().trim()
    .required('Please enter your password')
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be at most 50 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, 'Password must contain at least one letter and one number'),
  confirmPassword: yup
    .string().trim()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

// Convert Yup schema to Naive UI rules
const rules: FormRules = {
  name: [
    {
      required: true,
      validator: async (_rule, value) => {
        try {
          await validationSchema.validateAt('name', { name: value })
        } catch (error: any) {
          throw new Error(error.message)
        }
      },
      trigger: ['input', 'blur']
    }
  ],
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
  ],
  confirmPassword: [
    {
      required: true,
      validator: async (_rule, value) => {
        try {
          await validationSchema.validateAt('confirmPassword', { 
            password: formValue.password, 
            confirmPassword: value 
          })
        } catch (error: any) {
          throw new Error(error.message)
        }
      },
      trigger: ['input', 'blur']
    }
  ]
}

const handleRegister = async (e: Event) => {
  e.preventDefault()
  
  if (!formRef.value) return
  
  try {
    // First validate the form - this will prevent submission if validation fails
    await formRef.value.validate()
    
    loading.value = true
    
    // Make API call (Yup validation is already handled by the form rules)
    await authApi.register({
      name: formValue.name,
      email: formValue.email,
      password: formValue.password
    })
    
    message.success('Registration successful! Please log in.')
    router.push('/login')
    
  } catch (error: any) {
    // Check if it's a form validation error (array of validation errors)
    if (Array.isArray(error) && error.length > 0) {
      // Form validation failed - don't show message as form will show inline errors
      message.error('Please check your input fields')
    }
    else if (error.response) {
      console.error('Registration error:', error.response)
      message.error(error.response?.data?.message || 'Registration failed. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
