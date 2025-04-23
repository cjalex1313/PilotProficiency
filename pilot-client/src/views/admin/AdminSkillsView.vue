<template>
  <div>
    <div class="text-3xl">Skills</div>
    <div class="mt-5">
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <DataTable :value="skills">
          <Column field="name" header="Name"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategoryApi } from '@/api/categoryApi'
import { useSkillApi } from '@/api/skillApi'
import { DataTable, Column } from 'primevue'
import { onMounted, ref } from 'vue'

const categoryApi = useCategoryApi()
const skillsApi = useSkillApi()

const isLoading = ref(true)
const categories = ref([])
const skills = ref([])

onMounted(async () => {
  try {
    const categoriesPromise = categoryApi.getCategories()
    const skillsPromise = skillsApi.getSkills()
    const [categoriesResponse, skillsResponse] = await Promise.all([
      categoriesPromise,
      skillsPromise,
    ])
    categories.value = categoriesResponse
    skills.value = skillsResponse
  } catch {
    this.categories.value = []
    this.skills.value = []
  } finally {
    isLoading.value = false
  }
})
</script>
