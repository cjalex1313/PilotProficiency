<template>
  <div>
    <div class="text-3xl">Skills</div>
    <div class="mt-5">
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <DataTable :value="skills">
          <template #header>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <Button @click="goToAddSkill" icon="pi pi-plus" rounded raised />
            </div>
          </template>
          <Column field="name" header="Name"></Column>
          <Column field="description" header="Description"></Column>
          <Column header="Category">
            <template #body="slotProps">
              <span>{{ getCategoryName(slotProps.data.categoryId) }}</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategoryApi } from '@/api/categoryApi'
import { useSkillApi } from '@/api/skillApi'
import { DataTable, Column, Button } from 'primevue'
import { onMounted, ref, computed } from 'vue'

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

// Create a computed property that acts as a fast lookup map
// Maps category._id -> category.name
const categoryMap = computed(() => {
  const map = new Map()
  categories.value.forEach((category) => {
    // Use category._id or category.id depending on your data structure
    const categoryId = category._id || category.id
    if (categoryId) {
      map.set(categoryId, category.name)
    }
  })
  return map
})

// Function to get category name using the computed map
// This will be used in the DataTable template
const getCategoryName = (categoryId) => {
  return categoryMap.value.get(categoryId) || 'N/A' // Return name or 'N/A' if not found
}

const goToAddSkill = () => {
  console.log('add skill')
}
</script>
