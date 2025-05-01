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
              <Column class="!text-end">
                <template #body="{ data }">
                  <div class="flex justify-end items-center">
                    <Button
                      @click="tryEditPracticeLog(data)"
                      severity="secondary"
                      rounded
                      class="mr-2"
                      icon="pi pi-pencil"
                    />
                    <Button
                      @click="tryDeleteLog(data)"
                      severity="danger"
                      rounded
                      icon="pi pi-trash"
                    />
                  </div>
                </template>
              </Column>
              <template #empty> No logs found </template>
            </DataTable>
          </div>
        </div>
        <div
          v-if="skillTracked && practiceLogs && practiceLogs.length > 0"
          class="max-w-6xl mt-8 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-4 border border-gray-200"
        >
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Evolution chart</h2>
          </div>
          <div class="mt-4">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
          </div>
        </div>
      </div>
    </div>
    <AddEditPracticeLogModal
      v-if="showPracticeLogDialog"
      @closed="closePracticeLogDialog"
      @saved="savedPracticeLogDialog"
      :skill="skill"
      :practiceLogToEdit="practiceLogToEdit"
    />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { useSkillApi } from '@/api/skillApi'
import { useTrackedSkillsApi } from '@/api/trackedSkillApi'
import { Button, Checkbox, DataTable, Column, useConfirm, ConfirmDialog, useToast } from 'primevue'
import Chart from 'primevue/chart'
import { onMounted, ref, computed } from 'vue'
import { format } from 'date-fns'
import { useRoute, useRouter } from 'vue-router'
import AddEditPracticeLogModal from '@/components/practice-logs/AddEditPracticeLogModal.vue'
import { usePracticeLogsApi } from '@/api/practiceLogsApi'
import { proficiencyMap } from '@/helpers/constants'
import 'chartjs-adapter-date-fns'

const router = useRouter()
const route = useRoute()
const skillsApi = useSkillApi()
const trackedSkillsApi = useTrackedSkillsApi()
const practiceLogsApi = usePracticeLogsApi()
const confirm = useConfirm()
const toast = useToast()

const id = route.params.id

const isLoading = ref(true)
const skill = ref(null)
const skillTracked = ref(false)
const showPracticeLogDialog = ref(false)
const practiceLogs = ref([])
const practiceLogToEdit = ref(null)

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

const tryEditPracticeLog = (practiceLog) => {
  practiceLogToEdit.value = practiceLog
  showPracticeLogDialog.value = true
}

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
  if (logToSave.id) {
    await practiceLogsApi.updatePracticeLog(logToSave)
  } else {
    await practiceLogsApi.createPracticeLog(logToSave)
  }
  showPracticeLogDialog.value = false
  loadPracticeLogs()
}

const loadPracticeLogs = async () => {
  const skillLogsResponse = await practiceLogsApi.getSkillPracticeLogs(id)
  skillLogsResponse.sort((a, b) => {
    return new Date(b.practiceDate) - new Date(a.practiceDate)
  })
  practiceLogs.value = skillLogsResponse
}

const formatDate = (value) => {
  return format(value, 'PPP')
}

const getProficiencyText = (val) => {
  return proficiencyMap[val]
}

const tryDeleteLog = (log) => {
  confirm.require({
    message: `Are you sure you want to delete the log from ${format(log.practiceDate, 'PP')}?`,
    header: 'Delete practice log',
    icon: 'pi pi-trash',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      await practiceLogsApi.deletePracticeLog(log.id)
      const indexToRemove = practiceLogs.value.findIndex((c) => c.id == log.id)
      if (indexToRemove >= 0) {
        practiceLogs.value.splice(indexToRemove, 1)
      }
      toast.add({
        severity: 'success',
        summary: 'Skill deleted',
        detail: `Log from ${format(log.practiceDate, 'PP')} deleted`,
        life: 3000,
      })
    },
  })
}

const chartData = computed(() => {
  if (!practiceLogs.value || practiceLogs.value.length == 0) {
    return null
  }
  // 1. Sort your measurements by date (essential for a coherent line chart)
  const sortedMeasurements = [...practiceLogs.value] // Create a shallow copy to avoid mutating original ref
    .sort((a, b) => new Date(a.practiceDate).getTime() - new Date(b.practiceDate).getTime())

  // 2. Map the sorted data to the {x, y} format Chart.js expects for time scales
  const dataPoints = sortedMeasurements.map((measurement) => ({
    x: new Date(measurement.practiceDate), // Use the Date object directly for the x-value
    y: measurement.proficiency, // Use the proficiency for the y-value
  }))

  // 3. Return the structured data object for PrimeVue/Chart.js
  return {
    // Labels are less critical when using {x,y} data format with a time scale,
    // Chart.js derives labels from the 'x' values. You can provide them if needed
    // for specific configurations, but often not necessary here.
    // labels: dataPoints.map(p => p.x.toLocaleDateString()), // Example if needed
    datasets: [
      {
        label: skill.value.name, // Legend label for this dataset
        data: dataPoints, // The formatted {x, y} data points
        fill: false, // Don't fill area under the line (set to true for area chart)
        borderColor: '#42A5F5', // Line color (PrimeVue blue)
        tension: 0.1, // Makes the line slightly curved (0 for straight lines)
        // You can add more styling options here (pointRadius, pointBackgroundColor, etc.)
      },
      // Add more dataset objects here if you want to plot multiple skills/lines
    ],
  }
})

const chartOptions = ref({
  responsive: true, // Chart adapts to container size
  maintainAspectRatio: false, // Recommended for responsiveness in containers
  plugins: {
    legend: {
      position: 'top', // Position of the legend (e.g., 'top', 'bottom', 'left', 'right')
    },
    title: {
      display: true,
      text: 'Skill Proficiency Over Time', // Chart title
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        // Optional: You might want to customize the tooltip label as well
        label: function (tooltipItem) {
          const value = tooltipItem.raw.y // The numerical value
          let label = ''
          switch (value) {
            case 0:
              label = 'Needs Improvement'
              break
            case 1:
              label = 'Satisfactory'
              break
            case 2:
              label = 'Good'
              break
            case 3:
              label = 'Excellent'
              break
            default:
              label = `Value: ${value}` // Fallback for unexpected values
          }
          return ` ${tooltipItem.dataset.label}: ${label}`
        },
      },
    },
  },
  scales: {
    x: {
      type: 'time', // *** This is the crucial setting for the X-axis ***
      time: {
        tooltipFormat: 'PPP',
      },
      title: {
        display: true,
        text: 'Date', // X-axis label
      },
      offset: true,
    },
    y: {
      type: 'linear', // Standard numerical axis
      min: 0, // *** Set Y-axis minimum to 0 ***
      max: 3, // *** Set Y-axis maximum to 3 ***
      title: {
        display: true,
        text: 'Proficiency', // Y-axis label
      },
      ticks: {
        // *** Ensure ticks align with your defined integer values ***
        stepSize: 1,
        // *** Add the callback function for custom labels ***
        callback: function (value) {
          // 'value' is the numerical tick value (0, 1, 2, 3...)
          switch (value) {
            case 0:
              return 'Needs Improvement'
            case 1:
              return 'Satisfactory'
            case 2:
              return 'Good'
            case 3:
              return 'Excellent'
            default:
              // Hide labels for any other numeric values Chart.js might generate
              return null
          }
        },
        // Optional: Add padding if labels are long and might overlap axis title/chart
        padding: 5,
      },
    },
  },
})
</script>
