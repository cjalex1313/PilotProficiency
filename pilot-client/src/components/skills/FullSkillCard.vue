<template>
  <div
    class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
  >
    <div class="p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ skill.name }}</h2>
      <div class="mb-3">
        <span
          class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full self-center"
          >{{ skill.category.name }}</span
        >
        <div
          v-if="skill.latestPracticeLog"
          class="mt-3"
          :class="[proficiencyColors[skill.latestPracticeLog.proficiency]]"
        >
          {{ proficiencyMap[skill.latestPracticeLog.proficiency] }} - {{ formattedPracticeDate }}
        </div>
      </div>
      <p class="text-gray-600 text-sm">
        {{ skill.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { proficiencyColors, proficiencyMap } from '@/helpers/constants'
import { format } from 'date-fns'
import { computed } from 'vue'

const { skill } = defineProps(['skill'])

const formattedPracticeDate = computed(() => {
  if (skill?.latestPracticeLog?.practiceDate) {
    return format(new Date(skill.latestPracticeLog.practiceDate), 'PP')
  }
  return null
})
</script>
