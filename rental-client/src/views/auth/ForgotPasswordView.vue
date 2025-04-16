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
            {{ t('forgot-password.title') }}
          </h2>
          <h4 class="text-center text-lg tracking-tight text-gray-800">
            {{ t('forgot-password.subtitle') }}
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
        </div>
        <div v-if="emailError" class="mt-1 text-red-700">
          {{ emailError }}
        </div>
        <div v-if="!authData.isComplete" class="mt-6">
          <Button
            @click="tryResetPassword"
            :label="t('forgot-password.submit')"
            fluid
            :disabled="authData.isProcessing"
          />
        </div>
        <div v-else class="mt-2 text-center">
          {{ t('forgot-password.feedback') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button, FloatLabel, InputText } from 'primevue'
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { useAuthApi } from '@/api/authApi'

const { t } = useI18n()
const authApi = useAuthApi()

const authData = reactive({
  email: '',
  isProcessing: false,
  isComplete: false,
})

const rules = {
  email: {
    email,
    required,
  },
}

const v$ = useVuelidate(rules, authData)

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

const tryResetPassword = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  authData.isProcessing = true
  try {
    await authApi.requestResetPassword(authData.email)
    authData.isComplete = true
  } finally {
    authData.isProcessing = false
  }
}
</script>
