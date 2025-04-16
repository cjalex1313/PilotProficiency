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
            {{ t('reset-password.title') }}
          </h2>
          <h4 class="text-center text-lg tracking-tight text-gray-800">
            {{ t('reset-password.subtitle') }}
          </h4>
        </div>
        <div class="mt-6">
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
              <label for="password">{{ t('password') }}</label>
            </FloatLabel>
          </div>
          <div class="mt-4">
            <FloatLabel variant="on">
              <Password
                v-model="authData.confirmPassword"
                id="password"
                class="w-full"
                toggleMask
                fluid
                :invalid="!!confrimPasswordError"
                :feedback="false"
              />
              <label for="password">{{ t('confirmPassword') }}</label>
            </FloatLabel>
          </div>
        </div>
        <div v-if="passwordError" class="mt-1 text-red-700">
          {{ passwordError }}
        </div>
        <div v-if="confrimPasswordError" class="mt-1 text-red-700">
          {{ confrimPasswordError }}
        </div>
        <div v-else class="mt-6">
          <Button
            @click="tryResetPassword"
            :label="t('reset-password.submit')"
            fluid
            :disabled="isProcessing"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FloatLabel, Password, Button } from 'primevue'
import { useI18n } from 'vue-i18n'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthApi } from '../../api/authApi'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const authApi = useAuthApi()
const route = useRoute()
const router = useRouter()

const authData = reactive({
  password: '',
  confirmPassword: '',
  userId: '',
  token: '',
})

const isProcessing = ref(false)

const passwordIsSame = (password) => {
  return password === authData.password
}

onMounted(() => {
  if (!route.query.token || !route.query.userId) {
    router.push({
      name: 'Login',
    })
  }
  authData.userId = route.query.userId
  authData.token = route.query.token
})

const rules = {
  password: {
    required,
  },
  confirmPassword: {
    required,
    passwordIsSame,
  },
}

const v$ = useVuelidate(rules, authData)

const tryResetPassword = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  isProcessing.value = true
  try {
    await authApi.resetPassword(authData.userId, authData.token, authData.password)
    router.push({
      name: 'Login',
    })
  } finally {
    isProcessing.value = false
  }
}

const passwordError = computed(() => {
  if (!v$.value.password.$dirty) {
    return ''
  }
  if (v$.value.password.required.$invalid) {
    return t('register.password.required')
  }
  return ''
})

const confrimPasswordError = computed(() => {
  if (!v$.value.password.$dirty) {
    return ''
  }
  if (v$.value.password.required.$invalid) {
    return t('register.confirmPassword.required')
  }
  if (v$.value.confirmPassword.passwordIsSame.$invalid) {
    return t('register.confirmPassword.passwordIsSame')
  }
  return ''
})
</script>
