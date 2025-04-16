<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            class="mx-auto h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 class="mt-6 text-center text-3xl/9 font-bold tracking-tight text-gray-900">
            {{ t('login.title') }}
          </h2>
          <h4 class="text-center text-lg tracking-tight text-gray-800">
            {{ t('login.subtitle') }}
          </h4>
        </div>
        <div class="mt-6">
          <div>
            <FloatLabel variant="on">
              <InputText
                v-model="authData.email"
                id="email"
                class="w-full"
                :invalid="!!emailError"
              />
              <label for="email">{{ t('login.email.label') }}</label>
            </FloatLabel>
          </div>
          <div class="mt-4">
            <FloatLabel variant="on">
              <Password
                v-model="authData.password"
                id="password"
                class="w-full"
                toggleMask
                fluid
                :invalid="!!passwordError"
                :feedback="false"
              />
              <label for="password">{{ t('login.password.label') }}</label>
            </FloatLabel>
          </div>
        </div>
        <div v-if="emailError" class="mt-1 text-red-700">
          {{ emailError }}
        </div>
        <div v-if="passwordError" class="mt-1 text-red-700">
          {{ passwordError }}
        </div>
        <div class="mt-6">
          <div class="text-end">
            <Button
              @click="goToForgotPassword"
              variant="link"
              :label="t('login.forgot-password')"
              class="!pr-0"
            ></Button>
          </div>
          <Button @click="tryLogin" :label="t('login.login')" fluid />
          <div class="text-center mt-3">
            {{ t('login.no-account') }}
            <RouterLink class="hover:underline text-[#3bbfa1]" :to="{ name: 'Register' }">{{
              t('login.signup')
            }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { InputText, FloatLabel, Password, Button } from 'primevue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { computed, onMounted, reactive } from 'vue'
import { useAuthApi } from '../../api/authApi'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authApi = useAuthApi()
const authStore = useAuthStore()

const authData = reactive({
  email: '',
  password: '',
})

const rules = {
  email: {
    email,
    required,
  },
  password: {
    required,
  },
}

const v$ = useVuelidate(rules, authData)

const tryConfirmEmail = async () => {
  if (route.query.token && route.query.userId) {
    await authApi.confirmEmail(route.query.userId, route.query.token)
  }
}

onMounted(async () => {
  await tryConfirmEmail()
})

const goToForgotPassword = () => {
  router.push({
    name: 'ForgotPassword',
  })
}

const tryLogin = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  const response = await authApi.login(authData.email, authData.password)
  await authStore.setJwt(response.accessToken)
  router.push({
    name: 'Home',
  })
}

const emailError = computed(() => {
  if (!v$.value.email.$dirty) {
    return ''
  }
  if (v$.value.email.required.$invalid) {
    return t('login.email.required')
  }
  if (v$.value.email.email.$invalid) {
    return t('login.email.invalid')
  }
  return ''
})

const passwordError = computed(() => {
  if (!v$.value.password.$dirty) {
    return ''
  }
  if (v$.value.password.required.$invalid) {
    return t('login.password.required')
  }
  return ''
})
</script>
