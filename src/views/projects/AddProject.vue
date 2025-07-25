<template>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
    <n-card title="Add New Project">
      <!-- Add form -->
      <n-form @submit.prevent="onSubmit">
        <n-grid cols="1 m:2" x-gap="24" responsive="screen">
          <!-- Left Column - Main Fields -->
          <n-grid-item>
            <n-form-item label="Project Name" :feedback="errors.name">
              <n-input
                v-model:value="name"
                v-bind="nameAttrs"
                :status="errors.name ? 'error' : undefined"
                placeholder="Enter project name"
                :disabled="submitting"
              />
            </n-form-item>
            
            <n-form-item label="Description" :feedback="errors.description">
              <n-input
                v-model:value="description"
                v-bind="descriptionAttrs"
                :status="errors.description ? 'error' : undefined"
                placeholder="Enter project description"
                type="textarea"
                :rows="4"
                :disabled="submitting"
              />
            </n-form-item>

            <n-form-item label="Due Date" :feedback="errors.dueDate">
              <n-date-picker
                v-model:value="dueDate"
                :status="errors.dueDate ? 'error' : undefined"
                type="date"
                format="dd/MM/yyyy"
                placeholder="Select due date"
                :disabled="submitting"
                style="width: 100%;"
                @update:value="val => (dueDate = val)"
                @blur="dueDateAttrs.onBlur"
              />
            </n-form-item>

            <n-form-item label="Status" :feedback="errors.status">
              <n-select
                v-model:value="status"
                :status="errors.status ? 'error' : undefined"
                placeholder="Select project status"
                :options="statusOptions"
                :disabled="submitting"
                @update:value="val => (status = val)"
                @blur="statusAttrs.onBlur"
              />
            </n-form-item>
          </n-grid-item>

          <!-- Right Column - Image Fields -->
          <n-grid-item>
            <!-- File Upload -->
            <n-form-item label="Upload Image">
              <n-upload
                :custom-request="handleFileUpload"
                :show-file-list="false"
                accept="image/*"
                :disabled="submitting || uploading"
              >
                <n-upload-dragger>
                  <div style="margin-bottom: 12px">
                    <n-icon size="48" :depth="3">
                      <CloudUpload />
                    </n-icon>
                  </div>
                  <n-text style="font-size: 16px">
                    {{ uploading ? 'Uploading...' : 'Click or drag an image file to this area to upload' }}
                  </n-text>
                  <n-p depth="3" style="margin: 8px 0 0 0">
                    Supports JPG, PNG, GIF files. Max size 10MB.
                  </n-p>
                </n-upload-dragger>
              </n-upload>
            </n-form-item>

            <!-- Image preview -->
            <n-form-item v-if="imageUrl" label="Preview">
              <n-image
                :src="imageUrl"
                :alt="name || 'Project image'"
                style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 8px;"
                :preview-disabled="false"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        
        <n-form-item>
          <div style="display: flex; gap: 1rem; width: 100%;">
            <n-button
              type="primary"
              attr-type="submit"
              :loading="submitting"
              style="flex: 1;"
            >
              Create Project
            </n-button>
            <n-button
              @click="router.push('/projects')"
              :disabled="submitting"
              style="flex: 1;"
            >
              Cancel
            </n-button>
          </div>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { format, isValid, addMonths } from 'date-fns'
import { CloudUpload } from '@vicons/ionicons5'
import { 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NButton, 
  NP,
  NDatePicker,
  NSelect,
  NImage,
  NGrid,
  NGridItem,
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  useMessage
} from 'naive-ui'
import { projectsApi, fileApi } from '../../services/api'

const router = useRouter()
const message = useMessage()

const submitting = ref(false)
const uploading = ref(false)

const statusOptions = [
  { label: 'Not Started', value: 'not-started' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' }
]

const schema = yup.object({
  name: yup
    .string().trim()
    .required('Please enter project name')
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be at most 100 characters'),
  description: yup
    .string().trim()
    .max(500, 'Description must be at most 500 characters'),
  dueDate: yup
    .number()
    .required('Please select a due date')
    .transform((value) => (isNaN(value) ? null : value))
    .test('valid-date', 'Please select a valid due date', function(value) {
      // Check if timestamp creates a valid date
      const date = new Date(value)
      return isValid(date)
    }),
  status: yup
    .string()
    .required('Please select project status')
    .oneOf(['not-started', 'in-progress', 'completed'], 'Invalid status')
})

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    description: '',
    dueDate: addMonths(new Date(), 1).getTime(),
    status: 'not-started',
    imageUrl: ''
  }
})

const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [dueDate, dueDateAttrs] = defineField('dueDate')
const [status, statusAttrs] = defineField('status')
const [imageUrl] = defineField('imageUrl')

// File upload function
const handleFileUpload = async (options: any) => {
  const { file } = options
  
  try {
    uploading.value = true
    
    const response = await fileApi.uploadFile(file.file)
    const { imageUrl: uploadedImageUrl } = response.data
    
    // Update the imageUrl field with the uploaded image URL
    imageUrl.value = uploadedImageUrl
    
    message.success('Image uploaded successfully!')
    
    return {
      url: uploadedImageUrl
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    message.error('Failed to upload image. Please try again.')
    throw error
  } finally {
    uploading.value = false
  }
}

const onSubmit = handleSubmit(async (values: any) => {
  try {
    submitting.value = true
    
    const createData = {
      name: values.name,
      description: values.description,
      dueDate: values.dueDate ? format(values.dueDate, 'yyyy-MM-dd') : null,
      status: values.status,
      imageUrl: values.imageUrl || null
    }
    
    await projectsApi.createProject(createData)
    
    message.success('Project created successfully!')
    router.push('/projects')
    
  } catch (error: any) {
    console.error('Create error:', error)
    let errorMsg = error.response?.data?.message || 'Failed to create project. Please try again.'
    message.error(errorMsg)
  } finally {
    submitting.value = false
  }
})
</script>

<style scoped>
</style>
