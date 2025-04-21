<template>
  <Dialog
    :visible="true"
    :draggable="false"
    @update:visible="visibleChanged"
    modal
    position="top"
    :header="dialogHeader"
    style="margin-top: 100px; min-width: 400px"
  >
    <div>
      <div class="mt-5">
        <FloatLabel>
          <InputText id="category_name" v-model="category.name" fluid />
          <label for="category_name">Name</label>
        </FloatLabel>
      </div>
      <div class="mt-6">
        <FloatLabel>
          <Textarea id="category_description" v-model="category.description" rows="6" fluid />
          <label for="category_description">Description</label>
        </FloatLabel>
      </div>
    </div>
    <template #footer>
      <Button @click="close" label="Cancel" text severity="secondary" autofocus />
      <Button @click="save" label="Save" outlined severity="primary" autofocus />
    </template>
  </Dialog>
</template>

<script setup>
import { Dialog, InputText, FloatLabel, Textarea, Button } from 'primevue'
import { computed, ref } from 'vue'

const emit = defineEmits(['closed', 'saved'])
const props = defineProps(['category'])

const category = ref(props.category)

const dialogHeader = computed(() => {
  if (category.value?.id) {
    return 'Edit category'
  }
  return 'Add new category'
})

const close = () => {
  emit('closed')
}

const save = () => {
  emit('saved', category.value)
}

const visibleChanged = (val) => {
  if (!val) {
    emit('closed')
  }
}
</script>
