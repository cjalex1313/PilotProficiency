<template>
  <div class="p-6">
    <div class="text-3xl">Skills library</div>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <DataTable
        :value="skillsToDisplay"
        v-model:filters="filters"
        paginator
        :rows="10"
        dataKey="id"
        :globalFilterFields="['name', 'categoryName']"
      >
        <template #header>
          <div class="flex justify-end">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </IconField>
          </div>
        </template>
        <Column sortable field="name" header="Name"></Column>
        <Column sortable field="categoryName" header="Category"></Column>
        <Column header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.isTracked ? 'Tracked' : 'Untracked'"
              :severity="data.isTracked ? 'success' : 'danger'"
            />
          </template>
        </Column>
        <Column class="w-24 !text-end">
          <template #body="{ data }">
            <Button icon="pi pi-eye" @click="selectRow(data)" severity="secondary" rounded></Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { DataTable, Column, InputText, IconField, InputIcon, Button, Tag } from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'
import { onMounted, ref, computed } from 'vue'
import { useCategoryApi } from '@/api/categoryApi'
import { useSkillApi } from '@/api/skillApi'
import { useRouter } from 'vue-router'

const categoryApi = useCategoryApi()
const skillsApi = useSkillApi()
const router = useRouter()

const isLoading = ref(true)
const categories = ref([])
const skills = ref([])
const trackedSkills = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

onMounted(async () => {
  try {
    const categoriesPromise = categoryApi.getCategories()
    const skillsPromise = skillsApi.getSkills()
    const userTrackedSkillsPromise = skillsApi.getUserTrackedSkills()
    const [categoriesResponse, skillsResponse, userTrackSkillsResponse] = await Promise.all([
      categoriesPromise,
      skillsPromise,
      userTrackedSkillsPromise,
    ])
    categories.value = categoriesResponse
    skills.value = skillsResponse
    trackedSkills.value = userTrackSkillsResponse
  } catch {
    this.categories.value = []
    this.skills.value = []
  } finally {
    isLoading.value = false
  }
})

const skillsToDisplay = computed(() => {
  return skills.value.map((s) => {
    return {
      ...s,
      categoryName: getCategoryName(s.categoryId),
      isTracked: trackedSkills.value.includes(s.id),
    }
  })
})

const categoryMap = computed(() => {
  const map = new Map()
  categories.value.forEach((category) => {
    const categoryId = category._id || category.id
    if (categoryId) {
      map.set(categoryId, category.name)
    }
  })
  return map
})

const getCategoryName = (categoryId) => {
  return categoryMap.value.get(categoryId) || 'N/A'
}

const selectRow = (skill) => {
  router.push({
    name: 'SkillsLibraryDetails',
    params: {
      id: skill.id,
    },
  })
}
</script>
