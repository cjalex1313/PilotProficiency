<template>
  <div>
    <div class="text-3xl">Skills</div>
    <div class="mt-5">
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <DataTable :value="skillsToDisplay" dataKey="id">
          <template #header>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <Button @click="goToAddSkill" icon="pi pi-plus" rounded raised />
            </div>
          </template>
          <Column field="name" header="Name" sortable></Column>
          <Column header="Category" field="categoryName" sortable></Column>
          <Column field="description" header="Description"></Column>
          <Column class="!text-end">
            <template #body="{ data }">
              <Button
                @click="goToEditSkill(data.id)"
                severity="secondary"
                rounded
                class="mr-2"
                icon="pi pi-pencil"
              />
              <Button @click="tryDeleteSkill(data)" severity="danger" rounded icon="pi pi-trash" />
            </template>
          </Column>
        </DataTable>
        <ConfirmDialog />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategoryApi } from '@/api/categoryApi'
import { useSkillApi } from '@/api/skillApi'
import { DataTable, Column, Button, useConfirm, useToast, ConfirmDialog } from 'primevue'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const categoryApi = useCategoryApi()
const skillsApi = useSkillApi()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

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

const skillsToDisplay = computed(() => {
  return skills.value.map((s) => {
    return {
      ...s,
      categoryName: getCategoryName(s.categoryId),
    }
  })
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
  router.push({
    name: 'AdminSkillsFrom',
  })
}

const goToEditSkill = (id) => {
  router.push({
    name: 'AdminSkillsFrom',
    params: {
      id,
    },
  })
}

const tryDeleteSkill = (skill) => {
  confirm.require({
    message: `Are you sure you want to delete ${skill.name}?`,
    header: 'Delete skill',
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
      await skillsApi.deleteSkill(skill.id)
      const indexToRemove = skills.value.findIndex((c) => c.id == skill.id)
      if (indexToRemove >= 0) {
        skills.value.splice(indexToRemove, 1)
      }
      toast.add({
        severity: 'success',
        summary: 'Skill deleted',
        detail: `${skill.name} deleted`,
        life: 3000,
      })
    },
  })
}
</script>
