import { useBaseApi } from './baseApi'

export function useAuthApi() {
  const { baseApi } = useBaseApi()

  const login = (email, password) => {
    return baseApi.post('/auth/login', {
      email,
      password,
    })
  }

  const getProfile = () => {
    return baseApi.get('/auth/profile')
  }

  const register = (email, password, role) => {
    return baseApi.post('/auth/register', {
      email,
      password,
      role,
    })
  }

  const confirmEmail = (userId, token) => {
    return baseApi.patch('/auth/confirm-email', {
      userId,
      token,
    })
  }

  const requestResetPassword = (email) => {
    return baseApi.post('/auth/reset-password-request', {
      email,
    })
  }

  const resetPassword = (userId, token, newPassword) => {
    return baseApi.post('/auth/reset-password', {
      userId,
      token,
      newPassword
    });
  }

  return { login, getProfile, register, confirmEmail, requestResetPassword, resetPassword }
}
