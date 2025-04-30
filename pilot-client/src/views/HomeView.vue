<template>
  <div class="min-h-full">
    <div>
      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div v-if="isLoading">Loading...</div>
        <div v-else>
          <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">My Tracked Skills</h1>
          <div class="text-center">
            <Button @click="showPracticeLogModal" label="Log practice" />
          </div>
          <div v-if="needImprovmentsSkills && needImprovmentsSkills.length > 0">
            <div class="text-2xl font-bold text-gray-800 mt-6">Skills that need improvments</div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <FullSkillCard
                v-for="skill in needImprovmentsSkills"
                @click="goToSkillPage(skill.id)"
                :key="skill.id"
                :skill="skill"
              />
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800 mt-6">All tracked skills</div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <FullSkillCard
                v-for="skill in skills"
                @click="goToSkillPage(skill.id)"
                :key="skill.id"
                :skill="skill"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
    <AddEditPracticeLogModal
      v-if="practiceLogModalVisible"
      @closed="closePracticeLogDialog"
      @saved="addNewPracticeLog"
      :skills="skills"
    />
  </div>
</template>

<script setup>
import { useTrackedSkillsApi } from '@/api/trackedSkillApi'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from 'primevue'
import AddEditPracticeLogModal from '@/components/practice-logs/AddEditPracticeLogModal.vue'
import { usePracticeLogsApi } from '@/api/practiceLogsApi'
import FullSkillCard from '@/components/skills/FullSkillCard.vue'

const trackSkillsApi = useTrackedSkillsApi()
const router = useRouter()
const practiceLogsApi = usePracticeLogsApi()

const isLoading = ref(true)
const skills = ref([])
const practiceLogModalVisible = ref(false)

onMounted(async () => {
  try {
    const skillsResponse = await trackSkillsApi.getUserTrackedSkillsFull()
    skills.value = skillsResponse
  } finally {
    isLoading.value = false
  }
})

const needImprovmentsSkills = computed(() => {
  if (!skills.value) {
    return []
  }
  return skills.value.filter((s) => {
    return s.latestPracticeLog?.proficiency == 0
  })
})

const goToSkillPage = (skillId) => {
  router.push({
    name: 'SkillsLibraryDetails',
    params: {
      id: skillId,
    },
  })
}

const showPracticeLogModal = () => {
  practiceLogModalVisible.value = true
}

const closePracticeLogDialog = () => {
  practiceLogModalVisible.value = false
}

const addNewPracticeLog = async (logToSave) => {
  await practiceLogsApi.createPracticeLog(logToSave)
  practiceLogModalVisible.value = false
}
</script>
