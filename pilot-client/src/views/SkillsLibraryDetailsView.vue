<template>
  <div class="p-6">
    <div>
      <Button
        @click="goBack"
        icon="pi pi-angle-left"
        rounded
        variant="outlined"
        aria-label="Back"
      />
    </div>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div v-if="skill">
        <div
          class="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-4 border border-gray-200"
        >
          <div class="flex justify-between">
            <div>
              <h2 class="text-3xl font-bold text-gray-900">{{ skill.name }}</h2>
              <div class="text-sm text-gray-500">
                <span class="font-semibold">Category:</span>
                <span
                  class="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                >
                  {{ skill.category.name }}
                </span>
              </div>
            </div>
            <div class="flex items-center">
              <Checkbox
                @change="trackedChanged"
                v-model="skillTracked"
                inputId="skillTracked"
                class="mr-2"
                name="skillTracked"
                size="large"
                binary
              />
              <label for="skillTracked" class="text-xl"> Tracked </label>
            </div>
          </div>

          <div v-if="skill.description">
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Description</h3>
            <p class="text-gray-700 leading-relaxed">
              {{ skill.description }}
            </p>
          </div>

          <div v-if="skill.instructions">
            <h3 class="text-lg font-semibold text-gray-800 mb-1">Instructions</h3>
            <div class="text-gray-700 leading-relaxed space-y-2">
              <p class="whitespace-pre-wrap">
                {{ skill.instructions }}
              </p>
            </div>
          </div>
          <div class="flex justify-between">
            <div v-if="skill.relatedSkills">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Related Skills</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="relatedSkill in skill.relatedSkills"
                  :key="relatedSkill.id"
                  @click="goToSkill(relatedSkill.id)"
                  class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  {{ relatedSkill.name }}
                </span>
              </div>
            </div>
            <div v-if="skillTracked" class="flex items-center justify-self-end">
              <Button @click="openPracticeLogDialog" label="Log practice"></Button>
            </div>
          </div>
        </div>
        <div
          v-if="skillTracked"
          class="max-w-6xl mt-8 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-4 border border-gray-200"
        >
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Practice logs</h2>
          </div>
          <div v-if="practiceLogs">
            <DataTable :value="practiceLogs" dataKey="id">
              <Column field="practiceDate" header="Date">
                <template #body="{ data }">
                  {{ formatDate(data.practiceDate) }}
                </template></Column
              >
              <Column header="Proficiency" field="proficiency">
                <template #body="{ data }">
                  {{ getProficiencyText(data.proficiency) }}
                </template>
              </Column>
              <Column header="Notes" field="notes"
                ><template #body="{ data }">
                  <div class="">
                    {{ data.notes?.length > 20 ? data.notes.substring(0, 20) + '...' : data.notes }}
                  </div>
                </template></Column
              >
              <template #empty> No logs found </template>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
    <AddEditPracticeLogModal
      v-if="showPracticeLogDialog"
      @closed="closePracticeLogDialog"
      @saved="savedPracticeLogDialog"
      :skill="skill"
    />
  </div>
</template>

<script setup>
import { useSkillApi } from '@/api/skillApi'
import { useTrackedSkillsApi } from '@/api/trackedSkillApi'
import { Button, Checkbox, DataTable, Column } from 'primevue'
import { onMounted, ref } from 'vue'
import { format } from 'date-fns'
import { useRoute, useRouter } from 'vue-router'
import AddEditPracticeLogModal from '@/components/practice-logs/AddEditPracticeLogModal.vue'
import { usePracticeLogsApi } from '@/api/practiceLogsApi'
import { proficiencyMap } from '@/helpers/constants'

const router = useRouter()
const route = useRoute()
const skillsApi = useSkillApi()
const trackedSkillsApi = useTrackedSkillsApi()
const practiceLogsApi = usePracticeLogsApi()

const id = route.params.id

const isLoading = ref(true)
const skill = ref(null)
const skillTracked = ref(false)
const showPracticeLogDialog = ref(false)
const practiceLogs = ref([])

onMounted(async () => {
  try {
    loadPracticeLogs()
    const skillResponse = await skillsApi.getSkill(id)
    skill.value = skillResponse
    const trackedSkillsResponse = await trackedSkillsApi.getUserTrackedSkills()
    skillTracked.value = trackedSkillsResponse.includes(id)
  } finally {
    isLoading.value = false
  }
})

const goBack = () => {
  router.back()
}

const goToSkill = (id) => {
  router.push({
    name: 'SkillsLibraryDetails',
    params: {
      id,
    },
  })
}

const trackedChanged = async () => {
  if (skillTracked.value) {
    await trackedSkillsApi.trackSkill(id)
  } else {
    await trackedSkillsApi.untrackSkill(id)
  }
}

const openPracticeLogDialog = () => {
  showPracticeLogDialog.value = true
}

const closePracticeLogDialog = () => {
  showPracticeLogDialog.value = false
}

const savedPracticeLogDialog = async (logToSave) => {
  await practiceLogsApi.createPracticeLog(logToSave)
  showPracticeLogDialog.value = false
  loadPracticeLogs()
}

const loadPracticeLogs = async () => {
  const skillLogsResponse = await practiceLogsApi.getSkillPracticeLogs(id)
  skillLogsResponse.sort((a, b) => {
    return new Date(a.practiceDate) - new Date(b.practiceDate)
  })
  console.log(skillLogsResponse)
  practiceLogs.value = skillLogsResponse
}

const formatDate = (value) => {
  return format(value, 'PPP')
}

const getProficiencyText = (val) => {
  return proficiencyMap[val]
}
</script>
