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
            :disabled="skillsDisabled"
            :invalid="!!skillIdError"
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
      <div v-if="skillIdError" class="mt-2 text-red-700">
        {{ skillIdError }}
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
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const emit = defineEmits(['closed', 'saved'])
const props = defineProps(['skill', 'practiceLogToEdit', 'skills'])

const practiceLog = reactive({
  id: null,
  skillId: null,
  practiceDate: new Date(),
  proficiency: 0,
  notes: null,
})

const rules = {
  skillId: {
    required,
  },
}

const v$ = useVuelidate(rules, practiceLog)

const dialogHeader = computed(() => {
  return 'Add new practice log'
})

const skillOptions = computed(() => {
  if (props.skills) {
    return props.skills
  }
  return [props.skill]
})

const skillsDisabled = computed(() => {
  return !props.skills
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
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  emit('saved', practiceLog)
}

onMounted(() => {
  if (props.skill) {
    practiceLog.skillId = props.skill.id
  }
  if (props.practiceLogToEdit) {
    practiceLog.id = props.practiceLogToEdit.id
    practiceLog.skillId = props.practiceLogToEdit.skillId
    practiceLog.practiceDate = new Date(props.practiceLogToEdit.practiceDate)
    practiceLog.proficiency = props.practiceLogToEdit.proficiency
    practiceLog.notes = props.practiceLogToEdit.notes
  }
})

const skillIdError = computed(() => {
  if (!v$.value.skillId.$dirty) {
    return ''
  }
  if (v$.value.skillId.required.$invalid) {
    return 'Please select a skill'
  }
  return ''
})
</script>
