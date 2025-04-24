<template>
  <div>
    <div class="text-3xl">Skill {{ titleText }}</div>
    <div class="mt-3">
      <div v-if="isLoading || !skill">Loading...</div>
      <div v-else>
        <div class="grid grid-cols-2 gap-4 p-4">
          <div>
            <FloatLabel>
              <InputText id="name" v-model="skill.name" fluid />
              <label for="name">Name</label>
            </FloatLabel>
            <FloatLabel class="mt-6">
              <Select
                v-model="skill.categoryId"
                :options="categories"
                option-label="name"
                option-value="id"
                fluid
              />
              <label for="category">Category</label>
            </FloatLabel>
            <FloatLabel class="mt-6">
              <Textarea id="description" v-model="skill.description" rows="6" fluid />
              <label for="description">Description</label>
            </FloatLabel>
          </div>
          <div>
            <FloatLabel class="">
              <Textarea id="instructions" v-model="skill.instructions" rows="12" fluid />
              <label for="instructions">Instructions</label>
            </FloatLabel>
          </div>
        </div>
        <div class="mt-10">
          <div class="text-xl">Related skills</div>
          <DataTable :value="relatedSkills" dataKey="id">
            <template #header>
              <div class="flex flex-wrap items-center justify-end gap-2">
                <Button @click="addRelatedSkill" rounded raised label="Add a Related Skill" />
              </div>
            </template>
            <Column sortable field="name" header="Name"></Column>
            <Column sortable header="Category" field="categoryName"></Column>
            <Column field="description" header="Description"></Column>
            <Column class="!text-end">
              <template #body="{ data }">
                <Button
                  @click="removeSkill(data.id)"
                  severity="danger"
                  rounded
                  label="Remove"
                ></Button>
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="mt-4 text-end">
          <Button @click="saveSkill" label="Save" />
        </div>
      </div>
    </div>
    <AddRelatedSkillModal
      v-if="showAddRelatedSkillDialog"
      :skills="availableRelatedSkills"
      @closed="closeAddRelatedSkillDialog"
      @addSkill="onAddRelatedSkill"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryApi } from '@/api/categoryApi'
import { useSkillApi } from '@/api/skillApi'
import { FloatLabel, InputText, Select, Textarea, DataTable, Column, Button } from 'primevue'
import AddRelatedSkillModal from '@/components/skills/AddRelatedSkillModal.vue'

const route = useRoute()
const router = useRouter()
const categoryApi = useCategoryApi()
const skillsApi = useSkillApi()

const skillId = route.params.id
const isEdit = ref(!!skillId)
const isLoading = ref(true)
const skill = ref(null)
const categories = ref([])
const skills = ref([])
const showAddRelatedSkillDialog = ref(false)

const titleText = computed(() => {
  return isEdit.value ? 'edit' : 'add'
})

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
    if (isEdit.value && skillId) {
      const skillResponse = await skillsApi.getSkill(skillId)
      skill.value = skillResponse
    } else {
      skill.value = {
        name: '',
        description: null,
        instructions: null,
        categoryId: null,
        relatedSkillIds: [],
      }
    }
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

const relatedSkills = computed(() => {
  return skills.value
    .filter((s) => {
      return skill.value.relatedSkillIds.includes(s.id)
    })
    .map((s) => {
      return {
        ...s,
        categoryName: getCategoryName(s.categoryId),
      }
    })
})

// Function to get category name using the computed map
// This will be used in the DataTable template
const getCategoryName = (categoryId) => {
  return categoryMap.value.get(categoryId) || 'N/A' // Return name or 'N/A' if not found
}

const addRelatedSkill = () => {
  showAddRelatedSkillDialog.value = true
}

const availableRelatedSkills = computed(() => {
  return skills.value
    .filter((s) => {
      return s.id != skillId && !skill.value.relatedSkillIds.includes(s.id)
    })
    .map((s) => {
      const category = categories.value.find((c) => c.id == s.categoryId)
      return {
        id: s.id,
        name: s.name,
        categoryName: category?.name ?? 'N/A',
      }
    })
})

const saveSkill = async () => {
  if (!skillId) {
    await skillsApi.createSkill(skill.value)
  } else {
    await skillsApi.updateSkill(skill.value)
  }
  router.push({
    name: 'AdminSkills',
  })
}

const removeSkill = (id) => {
  const index = skill.value.relatedSkillIds.indexOf(id)
  if (index !== -1) {
    skill.value.relatedSkillIds.splice(index, 1)
  }
}

const closeAddRelatedSkillDialog = () => {
  showAddRelatedSkillDialog.value = false
}

const onAddRelatedSkill = (idToAdd) => {
  const index = skill.value.relatedSkillIds.findIndex((id) => id == idToAdd)
  if (index < 0) {
    skill.value.relatedSkillIds.push(idToAdd)
  }
  showAddRelatedSkillDialog.value = false
}
</script>
