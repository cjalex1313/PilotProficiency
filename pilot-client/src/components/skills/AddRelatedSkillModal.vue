<template>
  <Dialog
    :visible="true"
    :draggable="false"
    @update:visible="visibleChanged"
    modal
    header="Add related skill"
    style="min-width: 400px"
  >
    <div>
      <div>
        <InputText v-model="searchValue" placeholder="Search" fluid />
      </div>
      <div>
        <DataTable
          v-model:selection="selectedSkill"
          :value="visibleSkills"
          selection-mode="single"
          scrollable
          scrollHeight="400px"
          dataKey="id"
        >
          <Column sortable field="name" header="Name"></Column>
          <Column sortable field="categoryName" header="Category"></Column>
        </DataTable>
      </div>
      <div class="text-end mt-4">
        <Button @click="addRelatedSkill" :disabled="!selectedSkill" label="Add to Related Skills" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { Dialog, DataTable, Column, Button, InputText } from 'primevue'
import { computed, ref } from 'vue'

const { skills } = defineProps(['skills'])
const emit = defineEmits(['closed', 'addSkill'])

const selectedSkill = ref(null)
const searchValue = ref('')

const visibleChanged = (val) => {
  if (!val) {
    emit('closed')
  }
}

const visibleSkills = computed(() => {
  if (searchValue.value == '') {
    return skills
  }
  return skills.filter(
    (item) =>
      item.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchValue.value.toLowerCase()),
  )
})

const addRelatedSkill = () => {
  emit('addSkill', selectedSkill.value.id)
}
</script>
