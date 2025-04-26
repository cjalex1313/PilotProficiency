<template>
  <div class="min-h-full">
    <div>
      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div v-if="isLoading">Loading...</div>
        <div v-else>
          <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">My Tracked Skills</h1>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="skill in skills"
              @click="goToSkillPage(skill.id)"
              :key="skill.id"
              class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ skill.name }}</h2>
                <div class="mb-3">
                  <span
                    class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >{{ skill.category.name }}</span
                  >
                </div>
                <p class="text-gray-600 text-sm">
                  {{ skill.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useTrackedSkillsApi } from '@/api/trackedSkillApi'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const trackSkillsApi = useTrackedSkillsApi()
const router = useRouter()

const isLoading = ref(true)
const skills = ref([])

onMounted(async () => {
  try {
    const skillsResponse = await trackSkillsApi.getUserTrackedSkillsFull()
    skills.value = skillsResponse
  } finally {
    isLoading.value = false
  }
})

const goToSkillPage = (skillId) => {
  router.push({
    name: 'SkillsLibraryDetails',
    params: {
      id: skillId,
    },
  })
}
</script>
