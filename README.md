# Project Space App

A modern project management application built with Vue 3, TypeScript, and Naive UI. This application allows users to create, manage, and track projects with full CRUD functionality, authentication, and file upload capabilities.

## ✨ Features

### 🔐 Authentication System
- User registration and login
- JWT-based authentication with cookies
- Protected routes and role-based access
- User session management

### 📋 Project Management
- **Create Projects**: Add new projects with details, due dates, and images
- **View Projects**: Browse all projects in a responsive grid layout
- **Edit Projects**: Update project information (owner permissions)
- **Delete Projects**: Remove projects with confirmation modal
- **Search Projects**: Find projects using the search functionality
- **File Upload**: Drag-and-drop image upload for project covers

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Modern UI**: Clean interface using Naive UI component library
- **Date Handling**: Smart date formatting and validation
- **Loading States**: Smooth loading indicators and error handling
- **Form Validation**: Real-time validation using VeeValidate and Yup

## 🛠️ Tech Stack

### Frontend Framework
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### UI & Styling
- **Naive UI** - Vue 3 component library
- **Vicons/Ionicons5** - Icon set for modern interfaces
- **CSS Grid & Flexbox** - Responsive layout system

### Form Handling & Validation
- **VeeValidate 4** - Form validation library
- **Yup** - Schema validation
- **date-fns** - Date manipulation and formatting

### HTTP & API
- **Axios** - HTTP client with interceptors
- **RESTful API** - Backend integration
- **File Upload** - Multipart form data support

### Routing & State
- **Vue Router 4** - Client-side routing
- **Composables** - Reactive state management
- **Pinia-style** - Authentication state management

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
├── composables/         # Vue composition functions
│   └── useAuth.ts      # Authentication state management
├── router/             # Vue Router configuration
├── services/           # API services and HTTP client
│   └── api.ts         # Centralized API endpoints
├── views/             # Page components
│   ├── auth/          # Authentication pages
│   │   ├── Login.vue
│   │   └── Register.vue
│   ├── projects/      # Project management pages
│   │   ├── Projects.vue    # Project listing with search
│   │   ├── AddProject.vue  # Create new project
│   │   └── EditProject.vue # Edit/delete project
│   └── Home.vue       # Landing page
└── assets/            # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lihaiyun/project-space-app-vue.git
   cd project-space-app-vue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Key Features Overview

### Project Management Flow
1. **Authentication**: Users register/login to access the application
2. **Browse Projects**: View all projects in a responsive grid with search
3. **Create Projects**: Add new projects with form validation and file upload
4. **Manage Projects**: Edit or delete owned projects with proper permissions
5. **Search & Filter**: Find specific projects using the search functionality

### Form Validation
- **Real-time validation** using VeeValidate
- **Schema-based validation** with Yup
- **Custom date validation** for project due dates
- **File upload validation** with type and size constraints

### Date Handling
- **Smart formatting**: Display dates in user-friendly formats (dd/MM/yyyy, d MMM yyyy)
- **Default values**: New projects default to next month's date
- **Validation**: Ensure valid dates using date-fns
- **Timezone handling**: Consistent date handling across the application

## 🔧 Development

### Code Style
- **TypeScript** for type safety
- **Composition API** for better code organization
- **Single File Components** (SFC) with `<script setup>`
- **Reactive programming** with Vue 3 refs and computed

### API Integration
- **Centralized API service** in `services/api.ts`
- **Interceptors** for request/response handling
- **Error handling** with user-friendly messages
- **Loading states** for better UX

Learn more about Vue 3 and TypeScript in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
