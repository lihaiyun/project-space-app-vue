<template>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
    <n-card title="Edit Project">
      <!-- Loading state -->
      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <n-spin size="large" />
        <p style="margin-top: 1rem;">Loading project...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" style="text-align: center; padding: 2rem;">
        <n-p style="color: red;">{{ error }}</n-p>
        <n-button @click="fetchProject" style="margin-top: 1rem;">Retry</n-button>
      </div>

      <!-- Edit form -->
      <n-form v-else @submit.prevent="onSubmit">
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
                @update:value="dueDateAttrs['onUpdate:value']"
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
                @update:value="statusAttrs['onUpdate:value']"
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
              Update Project
            </n-button>
            <n-button
              type="error" ghost
              @click="showDeleteConfirmation = true"
              :disabled="submitting"
              style="flex: 1;"
            >
              Delete Project
            </n-button>
          </div>
        </n-form-item>
      </n-form>

      <!-- Delete Confirmation Modal -->
      <n-modal v-model:show="showDeleteConfirmation" preset="dialog" type="error" title="Delete Project">
        <template #header>
          <div>Delete Project</div>
        </template>
        <div>
          <p>Are you sure you want to delete this project? This action cannot be undone.</p>
        </div>
        <template #action>
          <div style="display: flex; gap: 1rem;">
            <n-button @click="showDeleteConfirmation = false" :disabled="deleting">
              Cancel
            </n-button>
            <n-button type="error" @click="handleDeleteProject" :loading="deleting">
              Delete
            </n-button>
          </div>
        </template>
      </n-modal>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { format, isValid } from 'date-fns'
import { CloudUpload } from '@vicons/ionicons5'
import { 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NButton, 
  NP,
  NSpin,
  NDatePicker,
  NSelect,
  NImage,
  NGrid,
  NGridItem,
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NModal,
  useMessage
} from 'naive-ui'
import { projectsApi, fileApi } from '../../services/api'

const router = useRouter()
const route = useRoute()
const message = useMessage()

const projectId = ref(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const uploading = ref(false)
const showDeleteConfirmation = ref(false)
const deleting = ref(false)

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

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: schema
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

// Delete project function
const handleDeleteProject = async () => {
  if (!projectId.value) {
    message.error('Invalid project ID')
    return
  }

  try {
    deleting.value = true
    
    await projectsApi.deleteProject(projectId.value)
    
    message.success('Project deleted successfully!')
    showDeleteConfirmation.value = false
    router.push('/projects')
    
  } catch (error: any) {
    console.error('Delete error:', error)
    let errorMsg = error.response?.data?.message || 'Failed to delete project. Please try again.'
    message.error(errorMsg)
  } finally {
    deleting.value = false
  }
}

// Fetch project data
const fetchProject = async () => {
  if (!projectId.value) {
    error.value = 'Invalid project ID'
    return
  }

  try {
    loading.value = true
    error.value = ''
    
    const response = await projectsApi.getProject(projectId.value)
    const project = response.data
    
    // Set form values
    setValues({
      name: project.name || '',
      description: project.description || '',
      dueDate: project.dueDate ? new Date(project.dueDate).getTime() : null,
      status: project.status || 'not-started',
      imageUrl: project.imageUrl || project.image_url || ''
    })
    
  } catch (err: any) {
    console.error('Error fetching project:', err)
    error.value = err.response?.data?.message || 'Failed to fetch project'
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(async (values: any) => {
  if (!projectId.value) {
    message.error('Invalid project ID')
    return
  }

  try {
    submitting.value = true
    
    const updateData = {
      name: values.name,
      description: values.description,
      dueDate: values.dueDate ? format(values.dueDate, 'yyyy-MM-dd') : null,
      status: values.status,
      imageUrl: values.imageUrl || null
    }
    
    await projectsApi.updateProject(projectId.value, updateData)
    
    message.success('Project updated successfully!')
    router.push('/projects')
    
  } catch (error: any) {
    console.error('Update error:', error)
    let errorMsg = error.response?.data?.message || 'Failed to update project. Please try again.'
    message.error(errorMsg)
  } finally {
    submitting.value = false
  }
})

// Fetch project when component mounts
onMounted(() => {
  if (projectId.value) {
    fetchProject()
  } else {
    error.value = 'Invalid project ID'
  }
})
</script>

<style scoped>
</style>
