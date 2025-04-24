import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import HomeView from '../views/HomeView.vue'
import BaseLayout from '@/layouts/baseLayout.vue'
import AuthLayout from '@/layouts/authLayout.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
import AdminLayout from '@/layouts/adminLayout.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminCategoriesView from '@/views/admin/AdminCategoriesView.vue'
import AdminSkillsView from '@/views/admin/AdminSkillsView.vue'
import AdminSkillAddEditView from '@/views/admin/AdminSkillAddEditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BaseLayout',
      meta: { requireAuth: true },
      component: BaseLayout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: HomeView,
        },
      ],
    },
    {
      path: '/admin',
      name: 'AdminLayout',
      meta: { requireAuth: true, requireAdmin: true },
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: AdminDashboardView,
        },
        {
          path: 'categories',
          name: 'AdminCategories',
          component: AdminCategoriesView,
        },
        {
          path: 'skills',
          name: 'AdminSkills',
          component: AdminSkillsView,
        },
        {
          path: 'skills/form/:id?',
          name: 'AdminSkillsFrom',
          component: AdminSkillAddEditView,
        },
      ],
    },
    {
      path: '/auth',
      name: 'AuthLayout',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'Login',
          component: LoginView,
        },
        {
          path: 'register',
          name: 'Register',
          component: RegisterView,
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: ForgotPasswordView,
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: ResetPasswordView,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const jwt = localStorage.getItem('jwt')
  if (to.meta.requireAuth && !jwt) {
    next({ name: 'Login' })
    return
  }
  if (!to.meta.requiresAuth && jwt && to.path.startsWith('/auth')) {
    next({ name: 'Home' })
    return
  }
  if (to.meta.requireAdmin) {
    if (!jwt) {
      next({ name: 'Login' })
      return
    }
    const decoded = jwtDecode(jwt)
    if (!decoded?.roles?.includes('Admin')) {
      next({ name: 'Login' })
      return
    }
  }
  next()
})

export default router
