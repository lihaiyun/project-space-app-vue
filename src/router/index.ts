import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Projects from '../views/projects/Projects.vue'
import AddProject from '../views/projects/AddProject.vue'
import EditProject from '../views/projects/EditProject.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/projects/add',
    name: 'AddProject',
    component: AddProject
  },
  {
    path: '/projects/:id/edit',
    name: 'EditProject',
    component: EditProject
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
