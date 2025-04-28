<template>
  <Dialog
    :visible="true"
    :draggable="false"
    @update:visible="visibleChanged"
    modal
    position="top"
    :header="dialogHeader"
    style="margin-top: 100px; min-width: 500px"
  >
    <div>
      <div class="mt-6">
        <FloatLabel>
          <Select
            v-model="practiceLog.skillId"
            inputId="skillLabel"
            :options="skillOptions"
            optionLabel="name"
            option-value="id"
            disabled
            fluid
          />
          <label for="skillLabel">Skill</label>
        </FloatLabel>
      </div>
      <div class="mt-6">
        <FloatLabel>
          <DatePicker
            v-model="practiceLog.practiceDate"
            inputId="practiceDate"
            showIcon
            iconDisplay="input"
            fluid
          />
          <label for="practiceDate">Practice date</label>
        </FloatLabel>
      </div>
      <div class="mt-6">
        <FloatLabel>
          <Select
            v-model="practiceLog.proficiency"
            inputId="proficiencyLabel"
            :options="proficiencyOptions"
            optionLabel="name"
            option-value="id"
            fluid
          />
          <label for="proficiencyLabel">Proficiency</label>
        </FloatLabel>
      </div>
      <div class="mt-6">
        <FloatLabel>
          <Textarea id="notes" v-model="practiceLog.notes" rows="5" fluid style="resize: none" />
          <label for="notes">Notes</label>
        </FloatLabel>
      </div>
      <div class="mt-6 flex justify-end">
        <Button @click="closeDialog" class="mr-3" label="Cancel" severity="secondary" />
        <Button @click="savePracticeLog" label="Save" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { Dialog, FloatLabel, Select, DatePicker, Textarea, Button } from 'primevue'
import { computed, onMounted, reactive } from 'vue'
import { proficiencyOptions } from '@/helpers/constants'

const emit = defineEmits(['closed', 'saved'])
const props = defineProps(['skill'])

const practiceLog = reactive({
  skillId: null,
  practiceDate: new Date(),
  proficiency: 0,
  notes: null,
})

const dialogHeader = computed(() => {
  return 'Add new practice log'
})

const skillOptions = computed(() => {
  return [props.skill]
})

const visibleChanged = (val) => {
  if (!val) {
    emit('closed')
  }
}

const closeDialog = () => {
  emit('closed')
}

const savePracticeLog = () => {
  emit('saved', practiceLog)
}

onMounted(() => {
  if (props.skill) {
    practiceLog.skillId = props.skill.id
  }
})
</script>
